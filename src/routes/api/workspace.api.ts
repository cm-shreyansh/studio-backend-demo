import type { FastifyPluginAsync } from 'fastify';

import { authMiddleware } from '../../middlewares/auth.js';
import WorkspaceRepository from '../../repository/workspace.repository.js';
import WorkspaceService from '../../services/workspace.service.js';

const workspaceRepository = new WorkspaceRepository();
const workspaceService = new WorkspaceService(workspaceRepository);

const workspaceApiRoutes: FastifyPluginAsync = async function (fastify) {
  // Create Workspace
  fastify.post(
    '/',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { name } = request.body as {
          name: string;
        };

        const { userId } = request.user as {
          userId: string;
          email: string;
        };

        const workspace = await workspaceService.createWorkspace(name, userId);

        return reply.status(201).send({
          success: true,
          message: 'Workspace created successfully',
          data: workspace,
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : 'Workspace creation failed',
        });
      }
    }
  );

  // Get My Workspaces
  fastify.get(
    '/',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { userId } = request.user as {
          userId: string;
          email: string;
        };

        const workspaces = await workspaceService.getUserWorkspaces(userId);

        return reply.send({
          success: true,
          data: workspaces,
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : 'Failed to fetch workspaces',
        });
      }
    }
  );

  // Get Workspace By Id
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

        const workspace = await workspaceService.getWorkspaceById(workspaceId);

        return reply.send({
          success: true,
          data: workspace,
        });
      } catch (error) {
        return reply.status(404).send({
          success: false,
          message:
            error instanceof Error ? error.message : 'Workspace not found',
        });
      }
    }
  );

  // Update Workspace
  fastify.put(
    '/:workspaceId',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { workspaceId } = request.params as {
          workspaceId: string;
        };

        const { name } = request.body as {
          name: string;
        };

        const workspace = await workspaceService.updateWorkspace(
          workspaceId,
          name
        );

        return reply.send({
          success: true,
          message: 'Workspace updated successfully',
          data: workspace,
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          message:
            error instanceof Error ? error.message : 'Workspace update failed',
        });
      }
    }
  );

  // Delete Workspace
  fastify.delete(
    '/:workspaceId',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { workspaceId } = request.params as {
          workspaceId: string;
        };

        const { userId } = request.user as {
          userId: string;
          email: string;
        };

        const result = await workspaceService.deleteWorkspace(
          workspaceId,
          userId
        );

        return reply.send({
          success: true,
          message: result.message,
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : 'Workspace deletion failed',
        });
      }
    }
  );
};

export default workspaceApiRoutes;
