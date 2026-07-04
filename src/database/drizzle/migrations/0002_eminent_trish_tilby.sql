CREATE TABLE `studios` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`owner_id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`branding_logo_url` text,
	`branding_color` varchar(7),
	`max_guests` int NOT NULL DEFAULT 5,
	`password_protected` boolean NOT NULL DEFAULT false,
	`password_hash` varchar(255),
	`invite_slug` varchar(16) NOT NULL,
	-- `created_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `studios_id` PRIMARY KEY(`id`),
	CONSTRAINT `studios_invite_slug_unique` UNIQUE(`invite_slug`)
);
--> statement-breakpoint
ALTER TABLE `studios` ADD CONSTRAINT `studios_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `studios` ADD CONSTRAINT `studios_owner_id_users_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `studios_workspace_id_idx` ON `studios` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `studios_invite_slug_idx` ON `studios` (`invite_slug`);--> statement-breakpoint


-- ALTER TABLE `users` DROP COLUMN `last_active_at`;