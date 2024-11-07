import type { onRequestHookHandler } from 'fastify';

export const setClientIp: onRequestHookHandler = (req, reply, done) => {
  const ip = (req.headers['http_client_ip'] as string) || (req.headers['http_x_forwarded_for'] as string) || (req.headers['remote_addr'] as string) || (req.ip as string);
  reply.clientIp = ip;
  done();
};
