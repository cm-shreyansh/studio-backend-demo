import crypto from 'crypto';

import StudioRepository from '../repository/studio.repository.js';
import WorkspaceRepository from '../repository/workspace.repository.js';

class StudioService {
  private studioRepository: StudioRepository;
  private workspaceRepository: WorkspaceRepository;

  constructor(
    studioRepository: StudioRepository,
    workspaceRepository: WorkspaceRepository
  ) {
    this.studioRepository = studioRepository;
    this.workspaceRepository = workspaceRepository;
  }

  async createStudio(
    workspaceId: string,
    userId: string,
    name: string,
    description?: string
  ) {
    // Check user is member of workspace
    const member = await this.workspaceRepository.findWorkspaceMember(
      workspaceId,
      userId
    );

    if (!member) {
      throw new Error('You are not a member of this workspace');
    }

    // Only owner can create studio
    if (member.role !== 'owner') {
      throw new Error('Only workspace owner can create studio');
    }

    // Generate invite slug
    const inviteSlug = crypto.randomBytes(4).toString('hex');

    // Check duplicate invite slug
    const existingStudio =
      await this.studioRepository.findStudioByInviteSlug(inviteSlug);

    if (existingStudio) {
      throw new Error('Invite slug already exists');
    }

    // Create studio
    const studio = await this.studioRepository.createStudio({
      id: crypto.randomUUID(),
      workspaceId,
      ownerId: userId,
      name,
      description,
      inviteSlug,
    });

    return studio;
  }

  async getWorkspaceStudios(workspaceId: string) {
    return await this.studioRepository.findWorkspaceStudios(workspaceId);
  }

  async getWorkspaceStudioCount(workspaceId: string) {
    const studioCount =
      await this.studioRepository.countWorkspaceStudios(workspaceId);

    return {
      workspaceId,
      studioCount,
    };
  }
}

export default StudioService;
