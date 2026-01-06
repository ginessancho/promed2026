-- Migration: Add ROI Model Data table
-- This stores the complete ROI calculation model as a JSON blob

CREATE TABLE IF NOT EXISTS `roiModelData` (
  `id` text PRIMARY KEY NOT NULL,
  `data` text NOT NULL,
  `version` integer DEFAULT 1 NOT NULL,
  `updatedAt` integer NOT NULL,
  `updatedBy` text
);

