import type { FastifyPluginAsync } from 'fastify';

import { authMiddleware } from '../../middlewares/auth.js';

import WorkspaceInviteRepository from '../../repository/workspace-invite.repository.js';
import WorkspaceRepository from '../../repository/workspace.repository.js';
import AuthRepository from '../../repository/auth.repository.js';

import WorkspaceInviteService from '../../services/workspace-invite.service.js';

const workspaceInviteRepository = new WorkspaceInviteRepository();
const workspaceRepository = new WorkspaceRepository();
const authRepository = new AuthRepository();

const workspaceInviteService = new WorkspaceInviteService(
  workspaceInviteRepository,
  workspaceRepository,
  authRepository
);

const workspaceInviteApiRoutes: FastifyPluginAsync = async function (fastify) {
  // Invite User
  fastify.post(
    '/',
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      try {
        const { workspaceId, email } = request.body as {
          workspaceId: string;
          email: string;
        };

        const { userId } = request.user as {
          userId: string;
          email: string;
        };

        const result = await workspaceInviteService.inviteUser(
          workspaceId,
          userId,
          email
        );

        return reply.status(201).send({
          success: true,
          message: 'Workspace invite sent successfully',
          data: result,
        });
      } catch (error) {
        return reply.status(400).send({
          success: false,
          message:
            error instanceof Error ? error.message : 'Workspace invite failed',
        });
      }
    }
  );
};

export default workspaceInviteApiRoutes;
