import * as nodeCache from 'node-cache';
import { type FastifyRequest } from 'fastify';
import type { ILink, IVerify } from '../types';

declare module 'fastify' {
  interface FastifyInstance {
    cache: nodeCache;
    getClientIp: (req: FastifyRequest) => string;
    viewExists: (filename: string) => boolean;
    parseUrl: (url?: string) => { pathname: string; filename: string };
    getSite: () => Promise<{ status: boolean; path: string }>;
    verify: (data: IVerify) => Promise<{ verified: boolean; data: string }>;
    getLink: (data: ILink) => Promise<{ success: boolean; data: string }>;
    config: {
      SITE_CODE: string;
      PORT: string;
      API_URI: string;
      LOADING_SCREEN_VARIATION: string;
      LIGHT_THEME_CODE: string;
      DARK_THEME_CODE: string;
    };
  }
}
