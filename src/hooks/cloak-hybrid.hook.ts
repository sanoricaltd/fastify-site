import { StatusCodes } from 'http-status-codes';
import * as Sentry from '@sentry/node';
import { SiteStates } from '../enums/site-states.js';
import { addNonce } from '../utils.js';
import type { TPreHandlerAsyncHookHandler, IRouteView } from '../types.js';

const keys: Record<SiteStates, string> = {
  [SiteStates.CLOAK_HYBRID]: 'GS6J45ejSWd36S5KTtRl',
  [SiteStates.WHITE]: '',
  [SiteStates.CLOAK_GCLID]: '',
  [SiteStates.CLOAK_DEFAULT]: '',
};

export const cloakHybrid: TPreHandlerAsyncHookHandler<IRouteView> = async (req, reply) => {
  if (![SiteStates.CLOAK_HYBRID].includes(reply.siteState)) return;

  const fastify = req.server;
  const key = keys[reply.siteState];

  if (!key) return;

  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const apiUrl = `${protocol}://${req.hostname}/api`;

    if (!req.cookies._vid) {
      return reply.code(StatusCodes.OK).view('loading', { rid: req.id, apiUrl, nonce: reply.cspNonce, key });
    }

    const { verified, data } = await fastify.verify({
      state: reply.siteState,
      shallow: true,
      visitorId: req.cookies._vid,
      referer: req.headers.referer,
      gclid: req.query.gclid,
      ip: reply.clientIp,
      userAgent: req.headers['user-agent'],
      requestUrl: new URL(req.url, `https://${req.headers.host}`).toString(),
    });

    if (!verified) return;

    const html = addNonce(data, reply.cspNonce.script);

    return reply.code(StatusCodes.OK).type('text/html').send(html);
  } catch (error) {
    Sentry.captureException(error);
    fastify.log.error(error);
  }
};
