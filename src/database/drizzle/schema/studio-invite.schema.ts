import {
  mysqlTable,
  varchar,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/mysql-core';

import { studios } from './studio.schema.js';
import { users } from './user.schema.js';

export const studioInvites = mysqlTable(
  'studio_invites',
  {
    id: varchar('id', { length: 36 }).primaryKey(),

    sessionId: varchar('session_id', { length: 64 }).notNull().unique(),

    studioId: varchar('studio_id', { length: 36 })
      .notNull()
      .references(() => studios.id, {
        onDelete: 'cascade',
      }),

    invitedBy: varchar('invited_by', { length: 36 })
      .notNull()
      .references(() => users.id),

    email: varchar('email', { length: 255 }).notNull(),

    role: varchar('role', { length: 20 }).notNull(),

    allowed: boolean('allowed').notNull().default(false),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    sessionIdx: index('studio_invites_session_idx').on(table.sessionId),
    studioIdx: index('studio_invites_studio_idx').on(table.studioId),
    emailIdx: index('studio_invites_email_idx').on(table.email),
  })
);
