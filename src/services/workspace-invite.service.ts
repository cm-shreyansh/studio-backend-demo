import crypto from 'crypto';

import EmailService from './email.service.js';

import AuthRepository from '../repository/auth.repository.js';
import WorkspaceInviteRepository from '../repository/workspace-invite.repository.js';
import WorkspaceRepository from '../repository/workspace.repository.js';

class WorkspaceInviteService {
  private workspaceInviteRepository: WorkspaceInviteRepository;
  private workspaceRepository: WorkspaceRepository;
  private authRepository: AuthRepository;
  private emailService: EmailService;

  constructor(
    workspaceInviteRepository: WorkspaceInviteRepository,
    workspaceRepository: WorkspaceRepository,
    authRepository: AuthRepository
  ) {
    this.workspaceInviteRepository = workspaceInviteRepository;
    this.workspaceRepository = workspaceRepository;
    this.authRepository = authRepository;
    this.emailService = new EmailService();
  }

  async inviteUser(workspaceId: string, invitedBy: string, email: string) {
    // Check workspace exists
    const workspace =
      await this.workspaceRepository.findWorkspaceById(workspaceId);

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Check inviter is member
    const member = await this.workspaceRepository.findWorkspaceMember(
      workspaceId,
      invitedBy
    );

    if (!member) {
      throw new Error('You are not a member of this workspace');
    }

    // Check pending invite already exists
    const existingInvite =
      await this.workspaceInviteRepository.findPendingInvite(
        workspaceId,
        email
      );

    if (existingInvite) {
      throw new Error('Invite already sent');
    }

    // Check user exists
    const userExists = await this.authRepository.userExists(email);

    // Generate token
    const token = crypto.randomUUID();

    // Create invite
    const invite = await this.workspaceInviteRepository.createInvite({
      id: crypto.randomUUID(),
      workspaceId,
      email,
      invitedBy,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Send email
    await this.emailService.sendWorkspaceInvite(email, token, userExists);

    return {
      invite,
      userExists,
    };
  }
}

export default WorkspaceInviteService;
