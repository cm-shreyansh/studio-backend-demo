import { eq } from 'drizzle-orm';

import db from '../config/database.js';
import { sessions } from '../database/drizzle/schema/session.schema.js';

class SessionRepository {
  // Create Session
  async createSession(session: {
    id: string;
    studioId: string;
    title: string;
  }) {
    await db.insert(sessions).values({
      id: session.id,
      studioId: session.studioId,
      title: session.title,
    });

    return session;
  }

  // Get Session By Id
  async findSessionById(id: string) {
    const result = await db.select().from(sessions).where(eq(sessions.id, id));

    return result[0] ?? null;
  }

  // Get Studio Sessions
  async findStudioSessions(studioId: string) {
    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.studioId, studioId));
  }

  // Update Session
  async updateSession(
    sessionId: string,
    data: {
      title: string;
    }
  ) {
    await db
      .update(sessions)
      .set({
        title: data.title,
      })
      .where(eq(sessions.id, sessionId));

    return this.findSessionById(sessionId);
  }

  // Delete Session
  async deleteSession(sessionId: string) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));

    return true;
  }
}

export default SessionRepository;
