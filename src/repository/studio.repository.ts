import { count, eq } from 'drizzle-orm';

import db from '../config/database.js';
import { studios } from '../database/drizzle/schema/studio.schema.js';

class StudioRepository {
  async createStudio(studio: {
    id: string;
    workspaceId: string;
    ownerId: string;
    name: string;
    description: string | undefined;
    inviteSlug: string;
  }) {
    await db.insert(studios).values({
      id: studio.id,
      workspaceId: studio.workspaceId,
      ownerId: studio.ownerId,
      name: studio.name,
      description: studio.description,
      inviteSlug: studio.inviteSlug,
    });

    return studio;
  }

  async findStudioById(id: string) {
    const result = await db
      .select({
        id: studios.id,
        workspaceId: studios.workspaceId,
        ownerId: studios.ownerId,
        name: studios.name,
        description: studios.description,
        brandingLogoUrl: studios.brandingLogoUrl,
        brandingColor: studios.brandingColor,
        maxGuests: studios.maxGuests,
        passwordProtected: studios.passwordProtected,
        inviteSlug: studios.inviteSlug,
        createdAt: studios.createdAt,
      })
      .from(studios)
      .where(eq(studios.id, id));

    return result[0] ?? null;
  }

  async findStudioByInviteSlug(inviteSlug: string) {
    const result = await db
      .select()
      .from(studios)
      .where(eq(studios.inviteSlug, inviteSlug));

    return result[0] ?? null;
  }

  async findWorkspaceStudios(workspaceId: string) {
    return await db
      .select({
        id: studios.id,
        workspaceId: studios.workspaceId,
        ownerId: studios.ownerId,
        name: studios.name,
        description: studios.description,
        brandingLogoUrl: studios.brandingLogoUrl,
        brandingColor: studios.brandingColor,
        maxGuests: studios.maxGuests,
        passwordProtected: studios.passwordProtected,
        inviteSlug: studios.inviteSlug,
        createdAt: studios.createdAt,
      })
      .from(studios)
      .where(eq(studios.workspaceId, workspaceId));
  }

  async countWorkspaceStudios(workspaceId: string) {
    const result = await db
      .select({
        studioCount: count(),
      })
      .from(studios)
      .where(eq(studios.workspaceId, workspaceId));

    return result[0]?.studioCount ?? 0;
  }

  async updateStudio(
    studioId: string,
    data: {
      name: string;
      description: string | undefined;
    }
  ) {
    await db
      .update(studios)
      .set({
        name: data.name,
        description: data.description,
      })
      .where(eq(studios.id, studioId));

    return this.findStudioById(studioId);
  }

  async deleteStudio(studioId: string) {
    await db.delete(studios).where(eq(studios.id, studioId));
  }
}

export default StudioRepository;
