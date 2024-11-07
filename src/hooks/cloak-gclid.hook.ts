import { fastifyCookie } from '@fastify/cookie';
import { StatusCodes } from 'http-status-codes';
import { nanoid } from 'nanoid';
import * as Sentry from '@sentry/node';
import { SiteStates } from '../enums/site-states.js';
import { addNonce } from '../utils.js';
import type { TPreHandlerAsyncHookHandler, IRouteView } from '../types.js';

export const cloakGclid: TPreHandlerAsyncHookHandler<IRouteView> = async (req, reply) => {
  if (reply.siteState !== SiteStates.CLOAK_GCLID) return;

  const fastify = req.server;

  try {
    const visitorId = req.cookies._vid || nanoid();

    if (!req.cookies._vid) {
      const vid = fastifyCookie.serialize('_vid', visitorId, {
        maxAge: 604_800,
        httpOnly: true,
      });

      reply.header('Set-Cookie', vid);
    }

    const { verified, data } = await fastify.verify({
      state: reply.siteState,
      requestId: req.id,
      visitorId,
      bLang: req.headers['accept-language'] || '',
      referer: req.headers.referer,
      gclid: req.query.gclid,
      ip: reply.clientIp,
      userAgent: req.headers['user-agent'],
      requestUrl: new URL(req.url, `https://${req.headers.host}`).toString(),
    });

    if (!verified) return;

    const html = addNonce(data, reply.cspNonce.script);

    reply.code(StatusCodes.OK).type('text/html').send(html);
  } catch (error) {
    fastify.log.error(error);
    Sentry.captureException(error);
  }
};
