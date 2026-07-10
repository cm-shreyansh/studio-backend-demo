import crypto from 'crypto';

import SessionRepository from '../repository/session.repository.js';
import StudioRepository from '../repository/studio.repository.js';
import WorkspaceRepository from '../repository/workspace.repository.js';

class SessionService {
  private sessionRepository: SessionRepository;
  private studioRepository: StudioRepository;
  private workspaceRepository: WorkspaceRepository;

  constructor(
    sessionRepository: SessionRepository,
    studioRepository: StudioRepository,
    workspaceRepository: WorkspaceRepository
  ) {
    this.sessionRepository = sessionRepository;
    this.studioRepository = studioRepository;
    this.workspaceRepository = workspaceRepository;
  }

  // Create Session
  async createSession(studioId: string, userId: string, title: string) {
    // Check studio exists
    const studio = await this.studioRepository.findStudioById(studioId);

    if (!studio) {
      throw new Error('Studio not found');
    }

    // Check workspace member
    const member = await this.workspaceRepository.findWorkspaceMember(
      studio.workspaceId,
      userId
    );

    if (!member) {
      throw new Error('You are not a member of this workspace');
    }

    // Only owner or producer can create session
    if (member.role !== 'owner' && member.role !== 'producer') {
      throw new Error('Only owner or producer can create session');
    }

    // Create session
    const session = await this.sessionRepository.createSession({
      id: crypto.randomUUID(),
      studioId,
      title,
    });

    return session;
  }

  // Get Session By Id
  async getSessionById(sessionId: string) {
    const session = await this.sessionRepository.findSessionById(sessionId);

    if (!session) {
      throw new Error('Session not found');
    }

    return session;
  }

  // Get Studio Sessions
  async getStudioSessions(studioId: string) {
    const studio = await this.studioRepository.findStudioById(studioId);

    if (!studio) {
      throw new Error('Studio not found');
    }

    return await this.sessionRepository.findStudioSessions(studioId);
  }

  // Update Session
  async updateSession(sessionId: string, userId: string, title: string) {
    // Check session exists
    const session = await this.sessionRepository.findSessionById(sessionId);

    if (!session) {
      throw new Error('Session not found');
    }

    // Get studio
    const studio = await this.studioRepository.findStudioById(session.studioId);

    if (!studio) {
      throw new Error('Studio not found');
    }

    // Check workspace member
    const member = await this.workspaceRepository.findWorkspaceMember(
      studio.workspaceId,
      userId
    );

    if (!member) {
      throw new Error('You are not a member of this workspace');
    }

    // Only owner or producer can update session
    if (member.role !== 'owner' && member.role !== 'producer') {
      throw new Error('Only owner or producer can update session');
    }

    return await this.sessionRepository.updateSession(sessionId, {
      title,
    });
  }

  // Delete Session
  async deleteSession(sessionId: string, userId: string) {
    // Check session exists
    const session = await this.sessionRepository.findSessionById(sessionId);

    if (!session) {
      throw new Error('Session not found');
    }

    // Get studio
    const studio = await this.studioRepository.findStudioById(session.studioId);

    if (!studio) {
      throw new Error('Studio not found');
    }

    // Check workspace member
    const member = await this.workspaceRepository.findWorkspaceMember(
      studio.workspaceId,
      userId
    );

    if (!member) {
      throw new Error('You are not a member of this workspace');
    }

    // Only owner or producer can delete session
    if (member.role !== 'owner' && member.role !== 'producer') {
      throw new Error('Only owner or producer can delete session');
    }

    await this.sessionRepository.deleteSession(sessionId);

    return {
      message: 'Session deleted successfully',
    };
  }
}

export default SessionService;
