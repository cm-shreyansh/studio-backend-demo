import {
  mysqlTable,
  varchar,
  text,
  int,
  smallint,
  timestamp,
  mysqlEnum,
  index,
} from 'drizzle-orm/mysql-core';

import { recordingSessions } from './recording-session.schema.js';
import { users } from './user.schema.js';

export const participantTracks = mysqlTable(
  'participant_tracks',
  {
    id: varchar('id', { length: 36 }).primaryKey(),

    sessionId: varchar('session_id', { length: 36 })
      .notNull()
      .references(() => recordingSessions.id, {
        onDelete: 'cascade',
      }),

    userId: varchar('user_id', { length: 36 }).references(() => users.id),

    guestDisplayName: varchar('guest_display_name', {
      length: 80,
    }),

    audioS3Key: text('audio_s3_key'),

    videoS3Key: text('video_s3_key'),

    audioFormat: varchar('audio_format', {
      length: 10,
    }),

    videoFormat: varchar('video_format', {
      length: 10,
    }),

    uploadStatus: mysqlEnum('upload_status', [
      'pending',
      'uploading',
      'complete',
      'failed',
    ])
      .notNull()
      .default('pending'),

    uploadProgressPct: smallint('upload_progress_pct').notNull().default(0),

    durationSecs: int('duration_secs'),

    joinedAt: timestamp('joined_at').defaultNow().notNull(),

    leftAt: timestamp('left_at'),
  },
  (table) => ({
    sessionIdx: index('participant_tracks_session_id_idx').on(table.sessionId),

    uploadStatusIdx: index('participant_tracks_upload_status_idx').on(
      table.uploadStatus
    ),
  })
);
