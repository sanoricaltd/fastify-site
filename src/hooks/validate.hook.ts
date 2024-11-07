import type { preValidationHookHandler } from 'fastify';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export const validate: preValidationHookHandler = (req, reply, done) => {
  const fastify = req.server;
  const { pathname, filename } = fastify.parseUrl(req.raw.url);
  const filePath = `sites/${fastify.config.SITE_CODE}/views${filename}`;
  const indexPath = `sites/${fastify.config.SITE_CODE}/views/index`;
  const exists = fastify.viewExists(filePath);

  if (!exists) reply.code(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);

  reply.locals = {
    indexPath,
    filePath,
    pathname,
  };

  done();
};
