CREATE TABLE `businessProcesses` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`department` text NOT NULL,
	`criticality` text DEFAULT 'medium' NOT NULL,
	`description` text,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `impactEstimates` (
	`id` text PRIMARY KEY NOT NULL,
	`metricId` text NOT NULL,
	`processId` text,
	`amount` real NOT NULL,
	`amountMin` real,
	`amountMax` real,
	`confidence` text DEFAULT 'low' NOT NULL,
	`source` text,
	`assumptions` text,
	`followUpRequired` integer DEFAULT false NOT NULL,
	`updatedAt` integer NOT NULL,
	`updatedBy` text,
	FOREIGN KEY (`metricId`) REFERENCES `metricDefinitions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`processId`) REFERENCES `businessProcesses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `metricDefinitions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`unit` text NOT NULL,
	`description` text,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `proposalIntro` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text DEFAULT 'Propuesta 2026' NOT NULL,
	`subtitle` text DEFAULT 'Evolución estratégica del ecosistema Odoo' NOT NULL,
	`strategicValueTitle` text DEFAULT 'Valor Estratégico' NOT NULL,
	`strategicValueSubtitle` text DEFAULT 'Impacto en el Negocio' NOT NULL,
	`strategicValueDetail` text DEFAULT 'Eficiencia, Precisión y Escalabilidad' NOT NULL,
	`timelineTitle` text DEFAULT '12 Meses' NOT NULL,
	`timelineSubtitle` text DEFAULT 'Timeline Completo' NOT NULL,
	`timelineDetail` text DEFAULT 'Ene - Dic 2026' NOT NULL,
	`phasesTitle` text DEFAULT '5 Fases' NOT NULL,
	`phasesSubtitle` text DEFAULT 'Taxonomía única' NOT NULL,
	`phasesDetail` text DEFAULT 'Valor continuo' NOT NULL,
	`visionTitle` text DEFAULT 'Visión Estratégica' NOT NULL,
	`visionText` text DEFAULT 'Este proyecto representa una evolución natural de la inversión en Odoo. El objetivo es convertir a Odoo en el centro del ciclo de ventas, desde la cotización hasta la facturación, eliminando el formulario F-007 y los procesos manuales asociados. Esto desbloqueará un nuevo nivel de eficiencia operativa y reducirá errores significativamente.' NOT NULL,
	`updatedAt` integer NOT NULL,
	`updatedBy` text
);
--> statement-breakpoint
CREATE TABLE `proposalPhases` (
	`id` text PRIMARY KEY NOT NULL,
	`technicalName` text NOT NULL,
	`conceptName` text NOT NULL,
	`duration` text NOT NULL,
	`gate` text NOT NULL,
	`objective` text NOT NULL,
	`outcome` text NOT NULL,
	`deliverables` text NOT NULL,
	`order` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updatedBy` text
);
