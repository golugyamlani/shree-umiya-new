CREATE TABLE `team_members` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`image` text NOT NULL,
	`display_order` integer DEFAULT 0
);
