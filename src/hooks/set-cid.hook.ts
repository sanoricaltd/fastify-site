import type { TPreHandlerHookHandler, IRouteView } from '../types.js';
import { fastifyCookie } from '@fastify/cookie';

export const setClickId: TPreHandlerHookHandler<IRouteView> = (req, reply, done) => {
  const key = req.query.gclid || req.query.gbraid || null;
  if (key) {
    const cid = fastifyCookie.serialize('_cid', key, {
      maxAge: 604_800,
      httpOnly: true,
    });

    reply.header('Set-Cookie', cid);
  }

  done();
};
