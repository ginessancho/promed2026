CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`loginMethod` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`lastSignedIn` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);
--> statement-breakpoint
CREATE TABLE `processEstimates` (
	`id` text PRIMARY KEY NOT NULL,
	`estimatedAnnualLossUSD` integer,
	`confidenceLevel` text DEFAULT 'unknown' NOT NULL,
	`assumptions` text,
	`updatedAt` integer NOT NULL,
	`updatedBy` text
);
--> statement-breakpoint
CREATE TABLE `processDataPoints` (
	`id` text PRIMARY KEY NOT NULL,
	`processId` text NOT NULL,
	`metricKey` text NOT NULL,
	`value` integer,
	`unit` text NOT NULL,
	`source` text,
	`sourceDetail` text,
	`confidenceLevel` text DEFAULT 'unknown' NOT NULL,
	`updatedAt` integer NOT NULL,
	`updatedBy` text
);
