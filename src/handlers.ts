import { fastifyCookie } from '@fastify/cookie';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
// import * as Sentry from '@sentry/node';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

/**
 * View handler.
 */
export const view =
  (fastify: FastifyInstance) =>
  async (
    req: FastifyRequest<{
      Querystring: { gclid?: string };
    }>,
    reply: FastifyReply,
  ) => {
    const { pathname, filename } = fastify.parseUrl(req.raw.url);
    const filePath = `sites/${fastify.config.SITE_CODE}/views${filename}`;
    const indexPath = `sites/${fastify.config.SITE_CODE}/views/index`;
    const exists = fastify.viewExists(filePath);

    if (!exists) {
      return reply.code(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }

    try {
      const site = await fastify.getSite();
      if (!site.status || site.path !== pathname) {
        return reply.viewAsync(filePath);
      }

      if (req.query.gclid) {
        const cookie = fastifyCookie.serialize('_cid', req.query.gclid, {
          maxAge: 604_800,
          httpOnly: true,
        });

        reply.header('Set-Cookie', cookie);
      }

      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const apiUrl = `${protocol}://${req.hostname}/api`;

      if (!req.cookies._vid) {
        return reply.code(StatusCodes.OK).viewAsync('loading', { rid: req.id, apiUrl });
      }

      const { verified, data } = await fastify.verify({
        shallow: true,
        visitorId: req.cookies._vid,
        referer: req.headers.referer,
        gclid: req.query.gclid,
        ip: fastify.getClientIp(req),
        userAgent: req.headers['user-agent'],
        requestUrl: new URL(req.url, `https://${req.headers.host}`).toString(),
      });

      if (!verified) return reply.viewAsync(indexPath);

      return reply.code(StatusCodes.OK).type('text/html').send(data);
    } catch (error) {
      fastify.log.error(error);
      // Sentry.captureException(error);
      return reply.code(StatusCodes.OK).viewAsync(filePath);
    }
  };

/**
 * API handler.
 */
export const api =
  (fastify: FastifyInstance) =>
  async (
    req: FastifyRequest<{
      Body: {
        id?: string;
        requestId?: string;
        visitorId?: string;
        bLang?: string;
      };
    }>,
    reply: FastifyReply,
  ) => {
    const { requestId, visitorId, bLang, id } = req.body;
    const indexPath = `sites/${fastify.config.SITE_CODE}/views/index`;

    // TODO: We need to find out some how if we don't get this information, maybe add Sentry here.
    if (!id || !requestId || !visitorId || !bLang) {
      // return reply.code(StatusCodes.FORBIDDEN).header('connection', 'close').send(ReasonPhrases.FORBIDDEN);

      // Show the cloak page when parameters are not sent correctly.
      // Most probably because the fingerprint script was blocked by the client
      return reply.code(StatusCodes.OK).type('text/html').viewAsync(indexPath);
    }

    const request = fastify.cache.get<{ referer: string; url: string }>(id);

    if (!request) {
      // return reply.code(StatusCodes.FORBIDDEN).header('connection', 'close').send(ReasonPhrases.FORBIDDEN);

      // Show the cloak page when parameters are not sent correctly.
      // Most probably because the fingerprint script was blocked by the client
      return reply.code(StatusCodes.OK).type('text/html').viewAsync(indexPath);
    }

    const cookie = fastifyCookie.serialize('_vid', visitorId, {
      maxAge: 604_800,
      httpOnly: true,
    });

    try {
      const res = await fastify.verify({
        visitorId,
        requestId,
        bLang,
        referer: request.referer,
        gclid: req.cookies._cid,
        ip: fastify.getClientIp(req),
        userAgent: req.headers['user-agent'],
        requestUrl: request.url,
      });

      if (res.verified) return reply.code(StatusCodes.OK).type('text/html').header('Set-Cookie', cookie).send(res.data);

      return reply.code(StatusCodes.OK).type('text/html').viewAsync(indexPath);
    } catch (error) {
      // Sentry.captureException(error);
      fastify.log.error(error);
      return reply.code(StatusCodes.OK).type('text/html').viewAsync(indexPath);
    }
  };

/**
 * Transport handler.
 */
export const transport =
  (fastify: FastifyInstance) =>
  async (
    req: FastifyRequest<{
      Params: { id?: string };
    }>,
    reply: FastifyReply,
  ) => {
    const { id } = req.params;

    if (!id || !req.cookies._cid || !req.cookies._vid) {
      return reply.code(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }

    try {
      const { success, data } = await fastify.getLink({
        campaignId: id,
        gclid: req.cookies._cid,
        visitorId: req.cookies._vid,
        ip: fastify.getClientIp(req),
        userAgent: req.headers['user-agent'],
      });

      if (!success) return reply.code(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);

      return reply.redirect(data);
    } catch (error) {
      // Sentry.captureException(error);
      return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  };

/**
 * Form process.
 */
export const handleForm = () => async (_req: FastifyRequest, reply: FastifyReply) => {
  return reply.send({ success: true });
};
