import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 */
export const users = sqliteTable("users", {
  /** Surrogate primary key. Auto-incremented numeric value managed by the database. */
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Process estimates for tracking USD impact of operational inefficiencies.
 * Used by the Procesos Críticos page for interview data collection.
 */
export const processEstimates = sqliteTable("processEstimates", {
  /** Process identifier: 'comodatos', 'consignacion', 'admin', etc. */
  id: text("id").primaryKey(),
  /** Estimated annual loss in USD. NULL means no data yet. */
  estimatedAnnualLossUSD: integer("estimatedAnnualLossUSD"),
  /** Confidence level of the estimate */
  confidenceLevel: text("confidenceLevel", { enum: ["confirmed", "estimated", "unknown"] }).default("unknown").notNull(),
  /** Interview notes and assumptions */
  assumptions: text("assumptions"),
  /** Last update timestamp */
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  /** Who updated this estimate */
  updatedBy: text("updatedBy"),
});

export type ProcessEstimate = typeof processEstimates.$inferSelect;
export type InsertProcessEstimate = typeof processEstimates.$inferInsert;

/**
 * Data source identifiers for process metrics.
 * Each represents a tool or method used to collect data.
 */
export const DATA_SOURCES = [
  "kawak",      // 600+ procedimientos formalizados
  "bamboohr",   // People, headcount, salaries
  "quicksight", // Finance dashboards
  "odoo",       // CRM, operations
  "apex",       // Current system transactions
  "redshift",   // AWS data warehouse
  "naf",        // Legacy ERP data
  "interview",  // Entrevista with person
] as const;

export type DataSource = (typeof DATA_SOURCES)[number];

/**
 * Individual data points for process cost analysis.
 * Each metric can be tracked with its source and confidence level.
 */
export const processDataPoints = sqliteTable("processDataPoints", {
  /** Composite key: processId:metricKey (e.g., "comodatos:contracts_active") */
  id: text("id").primaryKey(),
  /** Process identifier: 'comodatos', 'consignacion', 'admin', etc. */
  processId: text("processId").notNull(),
  /** Metric key: 'contracts_active', 'monthly_fee_avg', etc. */
  metricKey: text("metricKey").notNull(),
  /** The numeric value */
  value: integer("value"),
  /** Unit of measurement: 'USD', 'count', 'hours', 'percent', 'days' */
  unit: text("unit", { enum: ["USD", "count", "hours", "percent", "days"] }).notNull(),
  /** Data source tool or method */
  source: text("source", { enum: ["kawak", "bamboohr", "quicksight", "odoo", "apex", "redshift", "naf", "interview"] }),
  /** Additional source detail (e.g., "Entrevista con Gerente Ops, 10/12/2025") */
  sourceDetail: text("sourceDetail"),
  /** Confidence level of the value */
  confidenceLevel: text("confidenceLevel", { enum: ["confirmed", "estimated", "unknown"] }).default("unknown").notNull(),
  /** Last update timestamp */
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  /** Who updated this data point */
  updatedBy: text("updatedBy"),
});

export type ProcessDataPoint = typeof processDataPoints.$inferSelect;
export type InsertProcessDataPoint = typeof processDataPoints.$inferInsert;

/**
 * Content for the Proposal Introduction page.
 * Stores structured data for the Hero, Key Metrics, and Executive Summary sections.
 */
export const proposalIntro = sqliteTable("proposalIntro", {
  /** Single row identifier, e.g., 'default' */
  id: text("id").primaryKey(),
  
  /** Hero Section */
  title: text("title").notNull().default("Propuesta 2026"),
  subtitle: text("subtitle").notNull().default("Evolución estratégica del ecosistema Odoo"),
  
  /** Key Metric 1: Value */
  strategicValueTitle: text("strategicValueTitle").notNull().default("Valor Estratégico"),
  strategicValueSubtitle: text("strategicValueSubtitle").notNull().default("Impacto en el Negocio"),
  strategicValueDetail: text("strategicValueDetail").notNull().default("Eficiencia, Precisión y Escalabilidad"),
  
  /** Key Metric 2: Timeline */
  timelineTitle: text("timelineTitle").notNull().default("12 Meses"),
  timelineSubtitle: text("timelineSubtitle").notNull().default("Timeline Completo"),
  timelineDetail: text("timelineDetail").notNull().default("Ene - Dic 2026"),
  
  /** Key Metric 3: Phases */
  phasesTitle: text("phasesTitle").notNull().default("5 Fases"),
  phasesSubtitle: text("phasesSubtitle").notNull().default("Taxonomía única"),
  phasesDetail: text("phasesDetail").notNull().default("Valor continuo"),
  
  /** Executive Summary */
  visionTitle: text("visionTitle").notNull().default("Visión Estratégica"),
  visionText: text("visionText").notNull().default("Este proyecto representa una evolución natural de la inversión en Odoo. El objetivo es convertir a Odoo en el centro del ciclo de ventas, desde la cotización hasta la facturación, eliminando el formulario F-007 y los procesos manuales asociados. Esto desbloqueará un nuevo nivel de eficiencia operativa y reducirá errores significativamente."),
  
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedBy: text("updatedBy"),
});

export type ProposalIntro = typeof proposalIntro.$inferSelect;
export type InsertProposalIntro = typeof proposalIntro.$inferInsert;

/**
 * Structured phases for the proposal.
 */
export const proposalPhases = sqliteTable("proposalPhases", {
  id: text("id").primaryKey(), // e.g., 'phase-1'
  technicalName: text("technicalName").notNull(), // 'Fase 1: Diseño'
  conceptName: text("conceptName").notNull(), // 'Fundación'
  duration: text("duration").notNull(), // 'Enero - Febrero 2026 (8 semanas)'
  gate: text("gate").notNull(), // 'Blueprint aprobado...'
  objective: text("objective").notNull(), // 'Definir el modelo...'
  outcome: text("outcome").notNull(), // 'Reducción visible...'
  
  /** JSON blob for deliverables: { category: string; items: string[] }[] */
  deliverables: text("deliverables", { mode: "json" }).notNull(),
  
  order: integer("order").notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedBy: text("updatedBy"),
});

export type ProposalPhase = typeof proposalPhases.$inferSelect;
export type InsertProposalPhase = typeof proposalPhases.$inferInsert;
