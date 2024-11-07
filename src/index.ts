import './instrument.js';
import Fastify from 'fastify';
import { fastifyView } from '@fastify/view';
import { fastifyStatic } from '@fastify/static';
import { fastifyHelmet } from '@fastify/helmet';
import * as Sentry from '@sentry/node';
import { fastifyCookie } from '@fastify/cookie';
import { fastifyMultipart } from '@fastify/multipart';
import ejs from 'ejs';
import { fastifyEnv } from '@fastify/env';
import path from 'path';
import { evnOptions, loadingColorPalettes } from './config.js';
import { viewExists, getDirName } from './utils.js';
import { nanoid } from 'nanoid';
import { fastifyCors } from '@fastify/cors';
import { fastifyAutoload } from '@fastify/autoload';
import hexToRgba from 'hex-to-rgba';
import crypto from 'crypto';

const port = Number(process.env.PORT) || 8080;

const start = async () => {
  const __dirname = getDirName(import.meta);

  const fastify = Fastify({
    logger: process.env.NODE_ENV !== 'production',
    genReqId: () => nanoid(20),
    trustProxy: true,
    disableRequestLogging: true,
  });

  await fastify.register(fastifyEnv, evnOptions);

  fastify.register(fastifyCors, {
    origin: process.env.NODE_ENV === 'production' ? [`https://${process.env.DOMAIN}`, `https://www.${process.env.DOMAIN}`] : '*',
  });

  let nonce: string;
  fastify.addHook('onRequest', (_req, reply, done) => {
    nonce = crypto.randomBytes(16).toString('base64');
    reply.cspNonce = {
      script: nonce,
      style: '', // not enforcing it through helmet
    };
    done();
  });

  fastify.register(fastifyHelmet, {
    referrerPolicy: {
      policy: ['origin', 'unsafe-url'],
    },
    contentSecurityPolicy: {
      directives: {
        scriptSrc: ["'self'", () => `'nonce-${nonce}'`],
        connectSrc: ["'self'", '*.fpjs.io'],
        frameSrc: [
          "'self'",
          'https://*.youtube.com', // Allow framing from YouTube
          'https://*.youtube-nocookie.com', // Allow nocookie option for privacy
          'https://*.playngonetwork.com', // Allow framing from playngo
        ],
      },
    },
  });

  fastify.register(fastifyCookie, {
    parseOptions: {},
  });

  fastify.register(fastifyMultipart);

  Sentry.setupFastifyErrorHandler(fastify);

  if (!viewExists(`sites/${fastify.config.SITE_CODE}/views/index`)) {
    fastify.log.error(`EJS templates for this site code does not exist. (\`views/sites/${fastify.config.SITE_CODE}/views/index.ejs\`)`);
    process.exit(1);
  }
  if (!viewExists(`loading-templates/loading${fastify.config.LOADING_SCREEN_VARIATION}`)) {
    fastify.log.error('Correct env var for for loading screen variation is required. (defined in `views/loading-templates`)');
    process.exit(1);
  }
  if (!fastify.config.LIGHT_THEME_CODE || !(fastify.config.LIGHT_THEME_CODE in loadingColorPalettes)) {
    fastify.log.error('Correct env var for light color palette code is required. (defined in `config.ts``');
    process.exit(1);
  }
  if (!fastify.config.DARK_THEME_CODE || !(fastify.config.DARK_THEME_CODE in loadingColorPalettes)) {
    fastify.log.error('Correct env var for dark color palette code is required. (defined in `config.ts``');
    process.exit(1);
  }

  fastify.register(fastifyView, {
    root: path.join(__dirname, 'views'),
    engine: { ejs },
    defaultContext: {
      hexToRgba,
      loadingScreenVariation: fastify.config.LOADING_SCREEN_VARIATION,
      lightColorPalette: loadingColorPalettes[fastify.config.LIGHT_THEME_CODE],
      darkColorPalette: loadingColorPalettes[fastify.config.DARK_THEME_CODE],
    },
  });

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, `views/sites/${fastify.config.SITE_CODE}/public`),
    prefix: '/public/',
  });

  fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, 'plugins'),
  });

  // Start the server
  try {
    await fastify.listen({ port, host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

start();
