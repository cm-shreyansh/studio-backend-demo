import { mysqlTable, varchar, text, timestamp } from 'drizzle-orm/mysql-core';

import { workspaces } from './workspace.schema.js';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),

  workspaceId: varchar('workspace_id', { length: 36 })
    .notNull()
    .references(() => workspaces.id, {
      onDelete: 'cascade',
    }),

  email: varchar('email', { length: 255 }).notNull().unique(),

  displayName: varchar('display_name', { length: 80 }),

  role: varchar('role', { length: 20 }).notNull().default('editor'),

  avatarUrl: text('avatar_url'),

  // 👇 defaultNow() hata diya
  createdAt: timestamp('created_at').notNull(),

  lastActiveAt: timestamp('last_active_at'),
});
