import {
  mysqlTable,
  varchar,
  text,
  int,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/mysql-core';

import { workspaces } from './workspace.schema.js';
import { users } from './user.schema.js';

export const studios = mysqlTable(
  'studios',
  {
    id: varchar('id', { length: 36 }).primaryKey(),

    workspaceId: varchar('workspace_id', { length: 36 })
      .notNull()
      .references(() => workspaces.id, {
        onDelete: 'cascade',
      }),

    ownerId: varchar('owner_id', { length: 36 })
      .notNull()
      .references(() => users.id),

    name: varchar('name', { length: 100 }).notNull(),

    description: text('description'),

    brandingLogoUrl: text('branding_logo_url'),

    brandingColor: varchar('branding_color', { length: 7 }),

    maxGuests: int('max_guests').notNull().default(5),

    passwordProtected: boolean('password_protected').notNull().default(false),

    passwordHash: varchar('password_hash', { length: 255 }),

    inviteSlug: varchar('invite_slug', { length: 16 }).notNull().unique(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index('studios_workspace_id_idx').on(table.workspaceId),
    inviteSlugIdx: index('studios_invite_slug_idx').on(table.inviteSlug),
  })
);
