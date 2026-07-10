import { mysqlTable, varchar, timestamp, index } from 'drizzle-orm/mysql-core';

import { sessions } from './session.schema.js';
import { users } from './user.schema.js';

export const sessionMembers = mysqlTable(
  'session_members',
  {
    id: varchar('id', { length: 36 }).primaryKey(),

    sessionId: varchar('session_id', { length: 36 })
      .notNull()
      .references(() => sessions.id, {
        onDelete: 'cascade',
      }),

    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    role: varchar('role', { length: 20 }).notNull(),

    joinedAt: timestamp('joined_at').defaultNow().notNull(),
  },
  (table) => ({
    sessionIdx: index('session_members_session_id_idx').on(table.sessionId),
    userIdx: index('session_members_user_id_idx').on(table.userId),
  })
);
