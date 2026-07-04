import {
  mysqlTable,
  varchar,
  int,
  bigint,
  text,
  timestamp,
  json,
  mysqlEnum,
  index,
} from 'drizzle-orm/mysql-core';

import { studios } from './studio.schema.js';
import { users } from './user.schema.js';

export const recordingSessions = mysqlTable(
  'recording_sessions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),

    studioId: varchar('studio_id', { length: 36 })
      .notNull()
      .references(() => studios.id),

    hostId: varchar('host_id', { length: 36 })
      .notNull()
      .references(() => users.id),

    title: varchar('title', { length: 255 }),

    status: mysqlEnum('status', ['recording', 'processing', 'ready', 'failed'])
      .notNull()
      .default('recording'),

    durationSecs: int('duration_secs'),

    participantCount: int('participant_count').notNull().default(0),

    streamDestinations: json('stream_destinations'),

    compositeS3Key: text('composite_s3_key'),

    storageBytes: bigint('storage_bytes', {
      mode: 'number',
    })
      .notNull()
      .default(0),

    startedAt: timestamp('started_at').defaultNow().notNull(),

    endedAt: timestamp('ended_at'),
  },
  (table) => ({
    studioIdx: index('recording_sessions_studio_id_idx').on(table.studioId),

    hostIdx: index('recording_sessions_host_id_idx').on(table.hostId),

    statusIdx: index('recording_sessions_status_idx').on(table.status),

    startedAtIdx: index('recording_sessions_started_at_idx').on(
      table.startedAt
    ),
  })
);
