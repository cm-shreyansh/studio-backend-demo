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

  async getWorkspaceById(workspaceId: string) {
    const workspace =
      await this.workspaceRepository.findWorkspaceById(workspaceId);

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    return workspace;
  }

  async updateWorkspace(workspaceId: string, name: string) {
    // Check workspace exists
    const workspace =
      await this.workspaceRepository.findWorkspaceById(workspaceId);

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Generate new slug
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-');

    // Check slug already exists
    const existingWorkspace =
      await this.workspaceRepository.findWorkspaceBySlug(slug);

    if (existingWorkspace && existingWorkspace.id !== workspaceId) {
      throw new Error('Workspace slug already exists');
    }

    return await this.workspaceRepository.updateWorkspace(
      workspaceId,
      name,
      slug
    );
  }

  async deleteWorkspace(workspaceId: string, userId: string) {
    // Check workspace exists
    const workspace =
      await this.workspaceRepository.findWorkspaceById(workspaceId);

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Check user is owner
    const member = await this.workspaceRepository.findWorkspaceMember(
      workspaceId,
      userId
    );

    if (!member) {
      throw new Error('You are not a member of this workspace');
    }

    if (member.role !== 'owner') {
      throw new Error('Only workspace owner can delete workspace');
    }

    await this.workspaceRepository.deleteWorkspace(workspaceId);

    return {
      message: 'Workspace deleted successfully',
    };
  }
}

export default WorkspaceService;
