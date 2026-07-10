import { eq } from 'drizzle-orm';

import db from '../config/database.js';
import { studioInvites } from '../database/drizzle/schema/studio-invite.schema.js';
import { studioMembers } from '../database/drizzle/schema/studio-member.schema.js';

class StudioInviteRepository {
  async createInvite(invite: {
    id: string;
    sessionId: string;
    studioId: string;
    invitedBy: string;
    email: string;
    role: string;
  }) {
    await db.insert(studioInvites).values({
      id: invite.id,
      sessionId: invite.sessionId,
      studioId: invite.studioId,
      invitedBy: invite.invitedBy,
      email: invite.email,
      role: invite.role,
    });

    return invite;
  }
}

export default StudioInviteRepository;
