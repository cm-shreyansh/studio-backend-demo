import { mysqlTable, varchar, text, timestamp } from 'drizzle-orm/mysql-core';

import { workspaces } from './workspace.schema.js';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),

  workspaceId: varchar('workspace_id', { length: 36 }).references(
    () => workspaces.id,
    {
      onDelete: 'cascade',
    }
  ),

  email: varchar('email', { length: 255 }).notNull().unique(),

  // 👇 New field
  passwordHash: varchar('password_hash', {
    length: 255,
  }).notNull(),

  displayName: varchar('display_name', { length: 80 }),

  role: varchar('role', { length: 20 }).notNull().default('editor'),

  avatarUrl: text('avatar_url'),

  createdAt: timestamp('created_at').notNull(),

  lastActiveAt: timestamp('last_active_at'),
});
