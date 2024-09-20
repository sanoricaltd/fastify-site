import type { FastifyInstance } from 'fastify';
import type { ILink, IVerify } from './types.js';

/**
 * Retrieves the site data.
 * @param fastify - The Fastify instance.
 * @returns Promise<{ status: boolean; path: string; }>
 */
export const getSite = (fastify: FastifyInstance) => async (): Promise<{ status: boolean; path: string }> => {
  const res = await fetch(`${fastify.config.API_URI}/v1/site/${fastify.config.SITE_CODE}`);
  return await res.json();
};

/**
 * Verifies the visitor.
 * @param fastify - The Fastify instance.
 * @param visitorId - The visitor ID.
 * @param requestId - The request ID.
 * @param bLang - The browser language.
 * @param shallow - The shallow flag.
 * @param referer - The referer.
 * @param gclid - The gclid.
 * @param ip - The IP address.
 * @param userAgent - The user agent.
 * @param requestUrl - The request URL.
 * @returns Promise<{ verified: boolean; data: string; }>
 */
export const verify =
  (fastify: FastifyInstance) =>
  async ({ visitorId, requestId = '', bLang = '', shallow = false, referer = '', gclid = '', ip = '', userAgent = '', requestUrl = '' }: IVerify): Promise<{ verified: boolean; data: string }> => {
    const res = await fetch(`${fastify.config.API_URI}/v1/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        shallow,
        siteCode: fastify.config.SITE_CODE,
        visitorId,
        requestId,
        referer,
        gclid,
        lang: bLang,
        ip,
        useragent: userAgent,
        reqUrl: requestUrl,
      }),
    });

    return await res.json();
  };

/**
 * Retrieves the link.
 * @param fastify - The Fastify instance.
 * @param gclid - The gclid.
 * @param ip - The IP address.
 * @param visitorId - The visitor ID.
 * @param userAgent - The user agent.
 * @param campaignId - The campaign ID.
 * @returns Promise<{ success: boolean; data: string }>
 * @throws {Error} - Throws an error if the request fails.
 * @throws {Error} - Throws an error if the response is not JSON.
 */
export const getLink =
  (fastify: FastifyInstance) =>
  async ({ gclid = '', ip = '', visitorId = '', userAgent = '', campaignId = '' }: ILink) => {
    const res = await fetch(`${fastify.config.API_URI}/v1/link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        siteCode: fastify.config.SITE_CODE,
        campaignId,
        gclid,
        ip,
        visitorId,
        useragent: userAgent,
      }),
    });

    return res.json();
  };
