import { mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const workspaces = mysqlTable('workspaces', {
  id: varchar('id', { length: 36 }).primaryKey(),

  name: varchar('name', { length: 100 }).notNull(),

  slug: varchar('slug', { length: 50 }).notNull().unique(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
