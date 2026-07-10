import {
  mysqlTable,
  varchar,
  text,
  int,
  timestamp,
  index,
} from 'drizzle-orm/mysql-core';

import { studios } from './studio.schema.js';

export const sessions = mysqlTable(
  'sessions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),

    studioId: varchar('studio_id', { length: 36 })
      .notNull()
      .references(() => studios.id, {
        onDelete: 'cascade',
      }),

    title: varchar('title', { length: 255 }).notNull(),

    status: varchar('status', { length: 20 }).notNull().default('scheduled'),

    durationSeconds: int('duration_seconds').notNull().default(0),

    participantCount: int('participant_count').notNull().default(0),

    streamDestinations: text('stream_destinations'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    studioIdx: index('sessions_studio_id_idx').on(table.studioId),
    statusIdx: index('sessions_status_idx').on(table.status),
  })
);
