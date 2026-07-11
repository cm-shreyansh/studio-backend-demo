import {
  mysqlTable,
  varchar,
  timestamp,
  mysqlEnum,
  index,
} from 'drizzle-orm/mysql-core';

import { users } from './user.schema.js';
import { workspaces } from './workspace.schema.js';

export const workspaceInvites = mysqlTable(
  'workspace_invites',
  {
    id: varchar('id', { length: 36 }).primaryKey(),

    workspaceId: varchar('workspace_id', { length: 36 })
      .notNull()
      .references(() => workspaces.id, {
        onDelete: 'cascade',
      }),

    email: varchar('email', { length: 255 }).notNull(),

    invitedBy: varchar('invited_by', { length: 36 })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    status: mysqlEnum('status', ['pending', 'accepted', 'rejected'])
      .notNull()
      .default('pending'),

    token: varchar('token', { length: 255 }).notNull(),

    expiresAt: timestamp('expires_at').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index('workspace_invites_workspace_id_idx').on(
      table.workspaceId
    ),

    emailIdx: index('workspace_invites_email_idx').on(table.email),

    tokenIdx: index('workspace_invites_token_idx').on(table.token),
  })
);
