import type { onRequestHookHandler } from 'fastify';

export const forceHttps: onRequestHookHandler = (req, reply, done) => {
  if (process.env.NODE_ENV !== 'production') return done();

  const proto = req.headers['x-forwarded-proto'] || 'http';
  const isHttps = proto.includes('https');

  if (!isHttps) {
    const { url } = req;
    const host = req.headers.host || req.hostname;
    reply.redirect(`https://${host}${url}`, 301);
  }

  done();
};
