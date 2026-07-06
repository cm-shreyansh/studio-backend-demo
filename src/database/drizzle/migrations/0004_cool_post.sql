ALTER TABLE `users` MODIFY COLUMN `workspace_id` varchar(36);--> statement-breakpoint
ALTER TABLE `users` ADD `password_hash` varchar(255) NOT NULL;