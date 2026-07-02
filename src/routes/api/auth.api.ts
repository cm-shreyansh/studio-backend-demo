// import type {Fastify} from 'fastify';

import type { FastifyPluginAsync } from 'fastify';

const authApiRoutes: FastifyPluginAsync = async function (fastify, options) {
  fastify.get('/', async (request, reply) => {
    reply.send({ message: 'Auth API Bro' });
  });
};

export default authApiRoutes;
