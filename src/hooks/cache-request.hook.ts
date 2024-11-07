import type { onRequestHookHandler } from 'fastify';

export const cacheRequest: onRequestHookHandler = (req, _reply, done) => {
  const referer = req.headers.referer ?? '';
  req.server.cache.set(
    req.id,
    {
      url: new URL(req.url, `https://${req.headers.host}`).toString(),
      referer,
    },
    300,
  );
  done();
};
