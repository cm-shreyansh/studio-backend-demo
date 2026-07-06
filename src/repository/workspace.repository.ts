import { and, eq } from 'drizzle-orm';

import db from '../config/database.js';
import { workspaceMembers } from '../database/drizzle/schema/workspace-member.schema.js';
import { workspaces } from '../database/drizzle/schema/workspace.schema.js';

class WorkspaceRepository {
  async createWorkspace(workspace: { id: string; name: string; slug: string }) {
    await db.insert(workspaces).values({
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
    });

    return workspace;
  }

  async addMember(member: {
    id: string;
    workspaceId: string;
    userId: string;
    role: 'owner' | 'editor' | 'viewer';
  }) {
    await db.insert(workspaceMembers).values({
      id: member.id,
      workspaceId: member.workspaceId,
      userId: member.userId,
      role: member.role,
    });

    return member;
  }

  async findWorkspaceBySlug(slug: string) {
    const result = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, slug));

    return result[0] ?? null;
  }

  async findWorkspaceById(id: string) {
    const result = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, id));

    return result[0] ?? null;
  }

  async findWorkspaceMember(workspaceId: string, userId: string) {
    const result = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      );

    return result[0] ?? null;
  }

  async findUserWorkspaces(userId: string) {
    const result = await db
      .select({
        workspaceId: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
        role: workspaceMembers.role,
        joinedAt: workspaceMembers.joinedAt,
      })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
      .where(eq(workspaceMembers.userId, userId));

    return result;
  }
}

export default WorkspaceRepository;
