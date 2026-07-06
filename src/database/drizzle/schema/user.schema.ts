import { mysqlTable, varchar, text, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),

  email: varchar('email', { length: 255 }).notNull().unique(),

  passwordHash: varchar('password_hash', {
    length: 255,
  }).notNull(),

  displayName: varchar('display_name', { length: 80 }),

  avatarUrl: text('avatar_url'),

  createdAt: timestamp('created_at').notNull(),

  lastActiveAt: timestamp('last_active_at'),
});
