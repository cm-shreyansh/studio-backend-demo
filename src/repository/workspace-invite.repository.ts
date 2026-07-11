import { and, eq } from 'drizzle-orm';

import db from '../config/database.js';
import { workspaceInvites } from '../database/drizzle/schema/workspace-invite.schema.js';

class WorkspaceInviteRepository {
  // Create Invite
  async createInvite(invite: {
    id: string;
    workspaceId: string;
    email: string;
    invitedBy: string;
    token: string;
    expiresAt: Date;
  }) {
    await db.insert(workspaceInvites).values({
      id: invite.id,
      workspaceId: invite.workspaceId,
      email: invite.email,
      invitedBy: invite.invitedBy,
      token: invite.token,
      expiresAt: invite.expiresAt,
    });

    return invite;
  }

  // Find Invite By Token
  async findInviteByToken(token: string) {
    const result = await db
      .select()
      .from(workspaceInvites)
      .where(eq(workspaceInvites.token, token));

    return result[0] ?? null;
  }

  // Find Workspace Invites
  async findWorkspaceInvites(workspaceId: string) {
    return await db
      .select()
      .from(workspaceInvites)
      .where(eq(workspaceInvites.workspaceId, workspaceId));
  }

  // Find Pending Invite
  async findPendingInvite(workspaceId: string, email: string) {
    const result = await db
      .select()
      .from(workspaceInvites)
      .where(
        and(
          eq(workspaceInvites.workspaceId, workspaceId),
          eq(workspaceInvites.email, email),
          eq(workspaceInvites.status, 'pending')
        )
      );

    return result[0] ?? null;
  }

  // Update Invite Status
  async updateInviteStatus(inviteId: string, status: 'accepted' | 'rejected') {
    await db
      .update(workspaceInvites)
      .set({
        status,
      })
      .where(eq(workspaceInvites.id, inviteId));

    const result = await db
      .select()
      .from(workspaceInvites)
      .where(eq(workspaceInvites.id, inviteId));

    return result[0] ?? null;
  }

  // Delete Invite
  async deleteInvite(inviteId: string) {
    await db.delete(workspaceInvites).where(eq(workspaceInvites.id, inviteId));

    return true;
  }
}

export default WorkspaceInviteRepository;
