import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

/**
 * Parse the URL.
 * @param url The URL to parse.
 * @returns The parsed URL.
 */
export const parseUrl = (url?: string) => {
  if (!url) {
    return { pathname: '', filename: 'index' };
  }

  const u = url.split('?');
  const pathname = u[0];
  const filename = pathname === '/' ? '/index' : pathname;
  return { pathname, filename };
};

/**
 * Check if the view exists.
 * @param filename The name of the view file.
 * @returns Whether the view exists.
 */
export const viewExists = (filename: string): boolean => {
  const __dirname = getDirName(import.meta);
  const movedTrailingSlash = filename.replace(/\/$/, '');
  return existsSync(path.join(__dirname, 'views', `${movedTrailingSlash}.ejs`));
};

/**
 * Get the file name.
 * @param importMeta The import.meta object.
 * @returns The file name.
 */
export const getFileName = (importMeta: ImportMeta) => {
  return fileURLToPath(importMeta.url);
};

/**
 * Get the directory name.
 * @param importMeta The import.meta object.
 * @returns The directory name.
 */
export function getDirName(importMeta: ImportMeta) {
  return path.dirname(getFileName(importMeta));
}

/**
 * Add a nonce to the script tags in the HTML.
 * @param data The HTML to parse.
 * @param nonce The nonce to add to the script tags.
 * @returns The HTML with the nonce added to the script tags.
 */
export const addNonce = (data: string, nonce: string): string => {
  const $ = cheerio.load(data);
  $('script').each((_i: any, script: any) => {
    if (!$(script).attr('src')) {
      $(script).attr('nonce', nonce);
    }
  });
  return $.html();
};
