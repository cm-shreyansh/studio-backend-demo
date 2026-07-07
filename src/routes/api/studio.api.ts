import type { FastifyPluginAsync } from 'fastify';

import { authMiddleware } from '../../middlewares/auth.js';
import StudioRepository from '../../repository/studio.repository.js';
import WorkspaceRepository from '../../repository/workspace.repository.js';
import StudioService from '../../services/studio.service.js';

const studioRepository = new StudioRepository();
const workspaceRepository = new WorkspaceRepository();

const studioService = new StudioService(studioRepository, workspaceRepository);

const studioApiRoutes: FastifyPluginAsync = async function (fastify) {
  // Create Studio
  fastify.post(
    '/',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { workspaceId, name, description } = request.body as {
          workspaceId: string;
          name: string;
          description?: string;
        };

        const { userId } = request.user as {
          userId: string;
          email: string;
        };

        const studio = await studioService.createStudio(
          workspaceId,
          userId,
          name,
          description
        );

        return reply.status(201).send({
          success: true,
          message: 'Studio created successfully',
          data: studio,
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          message:
            error instanceof Error ? error.message : 'Studio creation failed',
        });
      }
    }
  );

  // Get Workspace Studio Count
  fastify.get(
    '/count/:workspaceId',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { workspaceId } = request.params as {
          workspaceId: string;
        };

        const studioCount =
          await studioService.getWorkspaceStudioCount(workspaceId);

        return reply.send({
          success: true,
          data: studioCount,
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : 'Failed to fetch studio count',
        });
      }
    }
  );

  // Get Studio By Id
  fastify.get(
    '/details/:studioId',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { studioId } = request.params as {
          studioId: string;
        };

        const studio = await studioService.getStudioById(studioId);

        return reply.send({
          success: true,
          data: studio,
        });
      } catch (error) {
        return reply.status(404).send({
          success: false,
          message: error instanceof Error ? error.message : 'Studio not found',
        });
      }
    }
  );

  // Update Studio
  fastify.put(
    '/:studioId',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { studioId } = request.params as {
          studioId: string;
        };

        const { name, description } = request.body as {
          name: string;
          description?: string;
        };

        const { userId } = request.user as {
          userId: string;
          email: string;
        };

        const studio = await studioService.updateStudio(
          studioId,
          userId,
          name,
          description
        );

        return reply.send({
          success: true,
          message: 'Studio updated successfully',
          data: studio,
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          message:
            error instanceof Error ? error.message : 'Studio update failed',
        });
      }
    }
  );

  // Delete Studio
  fastify.delete(
    '/:studioId',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { studioId } = request.params as {
          studioId: string;
        };

        const { userId } = request.user as {
          userId: string;
          email: string;
        };

        const result = await studioService.deleteStudio(studioId, userId);

        return reply.send({
          success: true,
          message: result.message,
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          message:
            error instanceof Error ? error.message : 'Studio deletion failed',
        });
      }
    }
  );

  // Get Workspace Studios
  fastify.get(
    '/:workspaceId',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { workspaceId } = request.params as {
          workspaceId: string;
        };

        const studios = await studioService.getWorkspaceStudios(workspaceId);

        return reply.send({
          success: true,
          data: studios,
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          message:
            error instanceof Error ? error.message : 'Failed to fetch studios',
        });
      }
    }
  );
};

export default studioApiRoutes;
