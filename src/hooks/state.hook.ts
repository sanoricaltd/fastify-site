import type { preValidationAsyncHookHandler } from 'fastify';
import * as Sentry from '@sentry/node';
import { SiteStates } from '../enums/site-states';

export const state: preValidationAsyncHookHandler = async (req, reply) => {
  const fastify = req.server;

  try {
    const site = await fastify.getSite();

    if (!site.status || site.path !== reply.locals.pathname) return;

    reply.siteState = site.state as SiteStates;
    return;
  } catch (error) {
    fastify.log.error(error);
    Sentry.captureException(error);
  }
};
