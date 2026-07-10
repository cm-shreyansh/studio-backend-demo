CREATE TABLE `session_members` (
	`id` varchar(36) NOT NULL,
	`session_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`role` varchar(20) NOT NULL,
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `session_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(36) NOT NULL,
	`studio_id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'scheduled',
	`duration_seconds` int NOT NULL DEFAULT 0,
	`participant_count` int NOT NULL DEFAULT 0,
	`stream_destinations` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studio_invites` (
	`id` varchar(36) NOT NULL,
	`session_id` varchar(64) NOT NULL,
	`studio_id` varchar(36) NOT NULL,
	`invited_by` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`role` varchar(20) NOT NULL,
	`allowed` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `studio_invites_id` PRIMARY KEY(`id`),
	CONSTRAINT `studio_invites_session_id_unique` UNIQUE(`session_id`)
);
--> statement-breakpoint
CREATE TABLE `studio_members` (
	`id` varchar(36) NOT NULL,
	`studio_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`role` varchar(20) NOT NULL,
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `studio_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `workspace_members` MODIFY COLUMN `role` enum('owner','producer','editor','viewer') NOT NULL DEFAULT 'viewer';--> statement-breakpoint
ALTER TABLE `session_members` ADD CONSTRAINT `session_members_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session_members` ADD CONSTRAINT `session_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_studio_id_studios_id_fk` FOREIGN KEY (`studio_id`) REFERENCES `studios`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `studio_invites` ADD CONSTRAINT `studio_invites_studio_id_studios_id_fk` FOREIGN KEY (`studio_id`) REFERENCES `studios`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `studio_invites` ADD CONSTRAINT `studio_invites_invited_by_users_id_fk` FOREIGN KEY (`invited_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `studio_members` ADD CONSTRAINT `studio_members_studio_id_studios_id_fk` FOREIGN KEY (`studio_id`) REFERENCES `studios`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `studio_members` ADD CONSTRAINT `studio_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `session_members_session_id_idx` ON `session_members` (`session_id`);--> statement-breakpoint
CREATE INDEX `session_members_user_id_idx` ON `session_members` (`user_id`);--> statement-breakpoint
CREATE INDEX `sessions_studio_id_idx` ON `sessions` (`studio_id`);--> statement-breakpoint
CREATE INDEX `sessions_status_idx` ON `sessions` (`status`);--> statement-breakpoint
CREATE INDEX `studio_invites_session_idx` ON `studio_invites` (`session_id`);--> statement-breakpoint
CREATE INDEX `studio_invites_studio_idx` ON `studio_invites` (`studio_id`);--> statement-breakpoint
CREATE INDEX `studio_invites_email_idx` ON `studio_invites` (`email`);--> statement-breakpoint
CREATE INDEX `studio_members_studio_id_idx` ON `studio_members` (`studio_id`);--> statement-breakpoint
CREATE INDEX `studio_members_user_id_idx` ON `studio_members` (`user_id`);