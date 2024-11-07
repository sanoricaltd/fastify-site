import * as nodeCache from 'node-cache';
import type { ILink, IVerify } from '../types';
import { SiteStates } from '../enums/site-states';

declare module 'fastify' {
  interface FastifyInstance {
    cache: nodeCache;
    viewExists: (filename: string) => boolean;
    parseUrl: (url?: string) => { pathname: string; filename: string };
    getSite: () => Promise<{ status: boolean; path: string; state: string }>;
    verify: (data: IVerify) => Promise<{ verified: boolean; data: string }>;
    getLink: (data: ILink) => Promise<{ success: boolean; data: string }>;
    config: {
      SITE_CODE: string;
      DOMAIN: string;
      PORT: string;
      API_URI: string;
      LOADING_SCREEN_VARIATION: string;
      LIGHT_THEME_CODE: string;
      DARK_THEME_CODE: string;
    };
  }

  interface FastifyReply {
    locals: {
      indexPath: string;
      filePath: string;
      pathname: string;
    };
    siteState: SiteStates;
    clientIp: string;
  }
}
