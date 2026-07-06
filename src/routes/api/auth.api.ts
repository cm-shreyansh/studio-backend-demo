import type { FastifyPluginAsync } from 'fastify';

// import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authMiddleware } from '../../middlewares/auth.js';
import AuthRepository from '../../repository/auth.repository.js';
import AuthService from '../../services/auth.service.js';

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

const authApiRoutes: FastifyPluginAsync = async function (fastify) {
  fastify.get('/', async (request, reply) => {
    reply.send({ message: 'Auth API Bro' });
  });

  fastify.get('/test', async (request, reply) => {
    reply.send({ message: 'Auth API Test' });
  });

  // Signup
  fastify.post('/signup', async (request, reply) => {
    try {
      const { displayName, email, password } = request.body as {
        displayName: string;
        email: string;
        password: string;
      };

      const user = await authService.signup(displayName, email, password);

      const token = fastify.jwt.sign({
        userId: user.id,
        email: user.email,
      });

      return reply.status(201).send({
        success: true,
        message: 'User created successfully',
        token,
        data: user,
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        message: error instanceof Error ? error.message : 'Signup failed',
      });
    }
  });

  // Signin
  fastify.post('/signin', async (request, reply) => {
    try {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };

      const user = await authService.login(email, password);

      const token = fastify.jwt.sign({
        userId: user.id,
        email: user.email,
      });

      return reply.status(200).send({
        success: true,
        message: 'Login successful',
        token,
        data: user,
      });
    } catch (error) {
      return reply.status(401).send({
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      });
    }
  });

  // Protected Route
  fastify.get(
    '/profile',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      return reply.send({
        success: true,
        message: 'Protected Route Accessed',
        user: request.user,
      });
    }
  );
};

export default authApiRoutes;
