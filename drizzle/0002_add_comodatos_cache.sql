CREATE TABLE `comodatosCache` (
	`key` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`rowCount` integer DEFAULT 0 NOT NULL,
	`updatedAt` integer NOT NULL
);
