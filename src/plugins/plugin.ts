import { fastifyPlugin } from 'fastify-plugin';
import NodeCache from 'node-cache';
import { getSite, verify, getLink } from '../api.js';
import { viewExists, parseUrl, getClientIp } from '../utils.js';

export default fastifyPlugin(async (fastify) => {
  const cache = new NodeCache();
  fastify.decorate('cache', cache);
  fastify.decorate('parseUrl', parseUrl);
  fastify.decorate('viewExists', viewExists);
  fastify.decorate('getClientIp', getClientIp);
  fastify.decorate('getSite', getSite(fastify));
  fastify.decorate('verify', verify(fastify));
  fastify.decorate('getLink', getLink(fastify));
  fastify.addHook('onRequest', (req, _reply, done) => {
    const referer = req.headers.referer ?? '';
    cache.set(
      req.id,
      {
        url: new URL(req.url, `https://${req.headers.host}`).toString(),
        referer,
      },
      300,
    );
    done();
  });
});
