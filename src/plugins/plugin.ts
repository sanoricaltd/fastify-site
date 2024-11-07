import { fastifyPlugin } from 'fastify-plugin';
import NodeCache from 'node-cache';
import { getSite, verify, getLink } from '../api.js';
import { viewExists, parseUrl } from '../utils.js';
import { cacheRequest } from '../hooks/cache-request.hook.js';
import { forceHttps } from '../hooks/force-https.hook.js';
import { setClientIp } from '../hooks/set-client-ip.hook.js';

export default fastifyPlugin(async (fastify) => {
  const cache = new NodeCache();
  fastify.decorate('cache', cache);
  fastify.decorate('parseUrl', parseUrl);
  fastify.decorate('viewExists', viewExists);
  fastify.decorate('getSite', getSite(fastify));
  fastify.decorate('verify', verify(fastify));
  fastify.decorate('getLink', getLink(fastify));
  fastify.addHook('onRequest', forceHttps);
  fastify.addHook('onRequest', cacheRequest);
  fastify.addHook('onRequest', setClientIp);
});
