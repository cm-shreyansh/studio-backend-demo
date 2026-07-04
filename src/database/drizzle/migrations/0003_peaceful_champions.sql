CREATE TABLE `participant_tracks` (
	`id` varchar(36) NOT NULL,
	`session_id` varchar(36) NOT NULL,
	`user_id` varchar(36),
	`guest_display_name` varchar(80),
	`audio_s3_key` text,
	`video_s3_key` text,
	`audio_format` varchar(10),
	`video_format` varchar(10),
	`upload_status` enum('pending','uploading','complete','failed') NOT NULL DEFAULT 'pending',
	`upload_progress_pct` smallint NOT NULL DEFAULT 0,
	`duration_secs` int,
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	`left_at` timestamp,
	CONSTRAINT `participant_tracks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recording_sessions` (
	`id` varchar(36) NOT NULL,
	`studio_id` varchar(36) NOT NULL,
	`host_id` varchar(36) NOT NULL,
	`title` varchar(255),
	`status` enum('recording','processing','ready','failed') NOT NULL DEFAULT 'recording',
	`duration_secs` int,
	`participant_count` int NOT NULL DEFAULT 0,
	`stream_destinations` json,
	`composite_s3_key` text,
	`storage_bytes` bigint NOT NULL DEFAULT 0,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`ended_at` timestamp,
	CONSTRAINT `recording_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `last_active_at` timestamp;--> statement-breakpoint
ALTER TABLE `participant_tracks` ADD CONSTRAINT `participant_tracks_session_id_recording_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `recording_sessions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `participant_tracks` ADD CONSTRAINT `participant_tracks_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recording_sessions` ADD CONSTRAINT `recording_sessions_studio_id_studios_id_fk` FOREIGN KEY (`studio_id`) REFERENCES `studios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recording_sessions` ADD CONSTRAINT `recording_sessions_host_id_users_id_fk` FOREIGN KEY (`host_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `participant_tracks_session_id_idx` ON `participant_tracks` (`session_id`);--> statement-breakpoint
CREATE INDEX `participant_tracks_upload_status_idx` ON `participant_tracks` (`upload_status`);--> statement-breakpoint
CREATE INDEX `recording_sessions_studio_id_idx` ON `recording_sessions` (`studio_id`);--> statement-breakpoint
CREATE INDEX `recording_sessions_host_id_idx` ON `recording_sessions` (`host_id`);--> statement-breakpoint
CREATE INDEX `recording_sessions_status_idx` ON `recording_sessions` (`status`);--> statement-breakpoint
CREATE INDEX `recording_sessions_started_at_idx` ON `recording_sessions` (`started_at`);