import { mysqlTable, varchar, timestamp, index } from 'drizzle-orm/mysql-core';

import { studios } from './studio.schema.js';
import { users } from './user.schema.js';

export const studioMembers = mysqlTable(
  'studio_members',
  {
    id: varchar('id', { length: 36 }).primaryKey(),

    studioId: varchar('studio_id', { length: 36 })
      .notNull()
      .references(() => studios.id, {
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
    studioIdx: index('studio_members_studio_id_idx').on(table.studioId),
    userIdx: index('studio_members_user_id_idx').on(table.userId),
  })
);
