import {
  mysqlTable,
  varchar,
  timestamp,
  mysqlEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';

import { users } from './user.schema.js';
import { workspaces } from './workspace.schema.js';

export const workspaceMembers = mysqlTable(
  'workspace_members',
  {
    id: varchar('id', { length: 36 }).primaryKey(),

    workspaceId: varchar('workspace_id', { length: 36 })
      .notNull()
      .references(() => workspaces.id, {
        onDelete: 'cascade',
      }),

    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    role: mysqlEnum('role', ['owner', 'editor', 'viewer'])
      .notNull()
      .default('viewer'),

    joinedAt: timestamp('joined_at').defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index('workspace_members_workspace_id_idx').on(
      table.workspaceId
    ),

    userIdx: index('workspace_members_user_id_idx').on(table.userId),

    workspaceUserUnique: uniqueIndex(
      'workspace_members_workspace_user_unique'
    ).on(table.workspaceId, table.userId),
  })
);
