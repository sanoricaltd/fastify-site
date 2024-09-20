import { fastifyPlugin } from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { view, api, transport, handleForm } from '../handlers.js';

const getView = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'GET',
    url: '/*',
    handler: view(fastify),
  });
};

const postApi = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/api',
    handler: api(fastify),
  });
};

const getTransport = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'GET',
    url: '/go/:id',
    handler: transport(fastify),
  });
};

const processForm = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/form/process',
    handler: handleForm,
  });
};

const getRobots = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'GET',
    url: '/robots.txt',
    handler: async (req, reply) => {
      reply.type('text/plain').send(`User-agent: Googlebot\nDisallow: /nogooglebot/\n\nUser-agent: *\nAllow: /\n\nSitemap: https://${req.hostname}/sitemap.xml`);
    },
  });
};

export default fastifyPlugin(async (fastify) => {
  fastify.register(postApi);
  fastify.register(processForm);
  fastify.register(getTransport);
  fastify.register(getRobots);
  fastify.register(getView);
});
