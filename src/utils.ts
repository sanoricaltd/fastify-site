import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { FastifyRequest } from 'fastify';

export const parseUrl = (url?: string) => {
  if (!url) {
    return { pathname: '', filename: 'index' };
  }

  const u = url.split('?');
  const pathname = u[0];
  const filename = pathname === '/' ? '/index' : pathname;
  return { pathname, filename };
};

export const viewExists = (filename: string): boolean => {
  const __dirname = getDirName(import.meta);
  return existsSync(path.join(__dirname, 'views', `${filename}.ejs`));
};

export const getClientIp = (req: FastifyRequest): string => {
  return (req.headers['http_client_ip'] as string) || (req.headers['http_x_forwarded_for'] as string) || (req.headers['remote_addr'] as string) || (req.ip as string);
};

export const getFileName = (importMeta: ImportMeta) => {
  return fileURLToPath(importMeta.url);
};

export function getDirName(importMeta: ImportMeta) {
  return path.dirname(getFileName(importMeta));
}
