import { fastifyCookie } from '@fastify/cookie';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import * as Sentry from '@sentry/node';
import type { RouteHandlerMethod } from 'fastify';
import type { TRouteHandlerMethod, IRouteApi, IRouteTransport } from './types.js';
import { addNonce } from './utils.js';

/**
 * View handler.
 */
export const view: RouteHandlerMethod = async (_req, reply) => {
  const { filePath } = reply.locals;
  return reply.code(StatusCodes.OK).viewAsync(filePath, { nonce: reply.cspNonce });
};

/**
 * API handler.
 */
export const api: TRouteHandlerMethod<IRouteApi> = async (req, reply) => {
  const { requestId, visitorId, bLang, id, nonce: previousHTTPRequestNonce } = req.body;
  const fastify = req.server;
  const indexPath = `sites/${fastify.config.SITE_CODE}/views/index`;

  if (!id || !requestId || !visitorId || !bLang) {
    // TODO: We need to find out some how if we don't get this information, maybe add Sentry here.
    // Show the safe page when parameters are not sent correctly.
    // Most probably because the fingerprint script was blocked by the client
    return reply
      .code(StatusCodes.OK)
      .type('text/html')
      .viewAsync(indexPath, { nonce: { script: previousHTTPRequestNonce, style: '' } });
  }

  const request = fastify.cache.get<{ referer: string; url: string }>(id);

  if (!request) {
    // TODO: We need to find out some how if we don't get this information, maybe add Sentry here.
    // Show the safe page when parameters are not sent correctly.
    // Most probably because the fingerprint script was blocked by the client
    return reply
      .code(StatusCodes.OK)
      .type('text/html')
      .viewAsync(indexPath, { nonce: { script: previousHTTPRequestNonce, style: '' } });
  }

  const cookie = fastifyCookie.serialize('_vid', visitorId, {
    maxAge: 604_800,
    httpOnly: true,
  });

  try {
    const { verified, data } = await fastify.verify({
      state: reply.siteState,
      visitorId,
      requestId,
      bLang,
      referer: request.referer,
      gclid: req.cookies._cid,
      ip: reply.clientIp,
      userAgent: req.headers['user-agent'],
      requestUrl: request.url,
    });

    reply.code(StatusCodes.OK).type('text/html').header('Set-Cookie', cookie);

    if (!verified) return reply.viewAsync(indexPath, { nonce: { script: previousHTTPRequestNonce, style: '' } });

    const html = addNonce(data, previousHTTPRequestNonce);

    return reply.send(html);
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    fastify.log.error(error);
    return reply
      .code(StatusCodes.OK)
      .type('text/html')
      .view(indexPath, { nonce: { script: previousHTTPRequestNonce, style: '' } });
  }
};

/**
 * Transport handler.
 */
export const transport: TRouteHandlerMethod<IRouteTransport> = async (req, reply) => {
  const { id } = req.params;
  const fastify = req.server;

  const indexPath = `sites/${fastify.config.SITE_CODE}/views/index`;

  if (!id || !req.cookies._vid) {
    return reply.code(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
  }

  try {
    const { success, data } = await fastify.getLink({
      campaignId: id,
      gclid: req.cookies._cid || '',
      visitorId: req.cookies._vid,
      ip: reply.clientIp,
      userAgent: req.headers['user-agent'],
    });

    if (!success) {
      return reply.code(StatusCodes.OK).viewAsync(indexPath, { nonce: reply.cspNonce });
    }

    return reply.redirect(data);
  } catch (error) {
    Sentry.captureException(error);
    return reply.code(StatusCodes.OK).viewAsync(indexPath, { nonce: reply.cspNonce });
  }
};

/**
 * Process form handler.
 */
export const handleForm: RouteHandlerMethod = async (_req, reply) => {
  return reply.send({ success: true });
};

/**
 * Robots handler.
 */
export const robots: RouteHandlerMethod = async (req, reply) => {
  reply.type('text/plain').send(`User-agent: Googlebot\nUser-agent: AdsBot-Googlebot\nAllow: /\nSitemap: https://${req.hostname}/sitemap.xml`);
};
