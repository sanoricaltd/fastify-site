import { fastifyPlugin } from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { view, api, transport, handleForm, robots } from '../handlers.js';
import { cloakDefault } from '../hooks/cloak-default.hook.js';
import { cloakHybrid } from '../hooks/cloak-hybrid.hook.js';
import { validate } from '../hooks/validate.hook.js';
import { state } from '../hooks/state.hook.js';
import { setClickId } from '../hooks/set-cid.hook.js';
import type { IRouteView } from '../types.js';
import { cloakGclid } from '../hooks/cloak-gclid.hook.js';

const getView = async (fastify: FastifyInstance) => {
  fastify.route<IRouteView>({
    method: 'GET',
    url: '/*',
    preValidation: [validate, state],
    preHandler: [setClickId, cloakDefault, cloakGclid, cloakHybrid],
    handler: view,
  });
};

const postApi = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/api',
    handler: api,
  });
};

const getTransport = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'GET',
    url: '/go/:id',
    handler: transport,
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
    handler: robots,
  });
};

export default fastifyPlugin(async (fastify) => {
  fastify.register(postApi);
  fastify.register(processForm);
  fastify.register(getTransport);
  fastify.register(getRobots);
  fastify.register(getView);
});
