import crypto from 'crypto';

import WorkspaceRepository from '../repository/workspace.repository.js';

class WorkspaceService {
  private workspaceRepository: WorkspaceRepository;

  constructor(workspaceRepository: WorkspaceRepository) {
    this.workspaceRepository = workspaceRepository;
  }

  async createWorkspace(name: string, userId: string) {
    // Generate slug
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-');

    // Check if slug already exists
    const existingWorkspace =
      await this.workspaceRepository.findWorkspaceBySlug(slug);

    if (existingWorkspace) {
      throw new Error('Workspace slug already exists');
    }

    // Create workspace
    const workspace = await this.workspaceRepository.createWorkspace({
      id: crypto.randomUUID(),
      name,
      slug,
    });

    // Add creator as owner
    await this.workspaceRepository.addMember({
      id: crypto.randomUUID(),
      workspaceId: workspace.id,
      userId,
      role: 'owner',
    });

    return workspace;
  }

  async getUserWorkspaces(userId: string) {
    const workspaces =
      await this.workspaceRepository.findUserWorkspaces(userId);

    const yourWorkspaces = workspaces.filter(
      (workspace) => workspace.role === 'owner'
    );

    const otherWorkspaces = workspaces.filter(
      (workspace) => workspace.role !== 'owner'
    );

    return {
      yourWorkspaces,
      otherWorkspaces,
    };
  }
}

export default WorkspaceService;
