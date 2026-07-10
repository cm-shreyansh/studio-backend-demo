import type { FastifyPluginAsync } from 'fastify';

import { authMiddleware } from '../../middlewares/auth.js';
import SessionRepository from '../../repository/session.repository.js';
import StudioRepository from '../../repository/studio.repository.js';
import WorkspaceRepository from '../../repository/workspace.repository.js';
import SessionService from '../../services/session.service.js';

const sessionRepository = new SessionRepository();
const studioRepository = new StudioRepository();
const workspaceRepository = new WorkspaceRepository();

const sessionService = new SessionService(
  sessionRepository,
  studioRepository,
  workspaceRepository
);

const sessionApiRoutes: FastifyPluginAsync = async function (fastify) {
  // Create Session

  fastify.post(
    '/',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { studioId, title } = request.body as {
          studioId: string;
          title: string;
        };

        const { userId } = request.user as {
          userId: string;
          email: string;
        };

        const session = await sessionService.createSession(
          studioId,
          userId,
          title
        );

        return reply.status(201).send({
          success: true,
          message: 'Session created successfully',
          data: session,
        });
      } catch (error) {
        console.error('Create Session Error:', error);

        return reply.status(400).send({
          success: false,
          message:
            error instanceof Error ? error.message : 'Session creation failed',
        });
      }
    }
  );

  // Get Studio Sessions
  fastify.get(
    '/studio/:studioId',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { studioId } = request.params as {
          studioId: string;
        };

        const sessions = await sessionService.getStudioSessions(studioId);

        return reply.send({
          success: true,
          data: sessions,
        });
      } catch (error) {
        return reply.status(404).send({
          success: false,
          message:
            error instanceof Error ? error.message : 'Failed to fetch sessions',
        });
      }
    }
  );

  // Get Session By Id
  fastify.get(
    '/:sessionId',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { sessionId } = request.params as {
          sessionId: string;
        };

        const session = await sessionService.getSessionById(sessionId);

        return reply.send({
          success: true,
          data: session,
        });
      } catch (error) {
        return reply.status(404).send({
          success: false,
          message: error instanceof Error ? error.message : 'Session not found',
        });
      }
    }
  );

  // Delete Session
  fastify.delete(
    '/:sessionId',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { sessionId } = request.params as {
          sessionId: string;
        };

        const { userId } = request.user as {
          userId: string;
          email: string;
        };

        const result = await sessionService.deleteSession(sessionId, userId);

        return reply.send({
          success: true,
          message: result.message,
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          message:
            error instanceof Error ? error.message : 'Session delete failed',
        });
      }
    }
  );
  // Update Session
  fastify.put(
    '/:sessionId',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { sessionId } = request.params as {
          sessionId: string;
        };

        const { title } = request.body as {
          title: string;
        };

        const { userId } = request.user as {
          userId: string;
          email: string;
        };

        const session = await sessionService.updateSession(
          sessionId,
          userId,
          title
        );

        return reply.send({
          success: true,
          message: 'Session updated successfully',
          data: session,
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          message:
            error instanceof Error ? error.message : 'Session update failed',
        });
      }
    }
  );
};

export default sessionApiRoutes;
