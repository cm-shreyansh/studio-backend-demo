// import type {Fastify} from 'fastify';

import type { FastifyPluginAsync } from 'fastify';

const authApiRoutes: FastifyPluginAsync = async function (fastify, options) {
  fastify.get('/', async (request, reply) => {
    reply.send({ message: 'Auth API Bro' });
  });
  fastify.get('/test', async (request, reply) => {
    reply.send({ message: 'Auth API Test' });
  });
};

export default authApiRoutes;
