import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

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
 * Definitions of ROI variables and metrics.
 * Defines what we are measuring (e.g., "Licensing Cost", "Processing Time").
 */
export const metricDefinitions = sqliteTable("metricDefinitions", {
  /** Unique key for the metric, e.g., 'license_cost', 'efficiency_gain' */
  id: text("id").primaryKey(),
  /** Human readable name */
  name: text("name").notNull(),
  /** Category of the metric */
  category: text("category", { enum: ["financial_cost", "financial_benefit", "operational_kpi", "risk_factor"] }).notNull(),
  /** Unit of measurement */
  unit: text("unit", { enum: ["USD", "hours", "count", "percent", "days", "score"] }).notNull(),
  /** Detailed description of what this metric represents */
  description: text("description"),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type MetricDefinition = typeof metricDefinitions.$inferSelect;
export type InsertMetricDefinition = typeof metricDefinitions.$inferInsert;

/**
 * Business processes that are being analyzed or improved.
 */
export const businessProcesses = sqliteTable("businessProcesses", {
  /** Unique key for the process, e.g., 'invoice_processing' */
  id: text("id").primaryKey(),
  /** Human readable name */
  name: text("name").notNull(),
  /** Department owning the process */
  department: text("department").notNull(), // Finance, Operations, etc.
  /** Criticality level */
  criticality: text("criticality", { enum: ["low", "medium", "high", "critical"] }).default("medium").notNull(),
  /** Description of the process */
  description: text("description"),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type BusinessProcess = typeof businessProcesses.$inferSelect;
export type InsertBusinessProcess = typeof businessProcesses.$inferInsert;

/**
 * Actual data points or estimates connecting metrics to processes (or global).
 */
export const impactEstimates = sqliteTable("impactEstimates", {
  /** Unique ID */
  id: text("id").primaryKey(),
  /** The metric being measured */
  metricId: text("metricId").notNull().references(() => metricDefinitions.id),
  /** The process this applies to (nullable for global project metrics like License Fee) */
  processId: text("processId").references(() => businessProcesses.id),
  
  /** The estimated or measured value */
  amount: real("amount").notNull(),
  /** Range estimates if uncertain */
  amountMin: real("amountMin"),
  amountMax: real("amountMax"),
  
  /** Confidence in this number */
  confidence: text("confidence", { enum: ["low", "medium", "high", "confirmed"] }).default("low").notNull(),
  /** Source of the data */
  source: text("source"), // e.g., "Interview with CFO", "Vendor Quote"
  /** Assumptions made */
  assumptions: text("assumptions"),
  /** Whether this needs follow-up */
  followUpRequired: integer("followUpRequired", { mode: "boolean" }).default(false).notNull(),
  
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedBy: text("updatedBy"),
});

export type ImpactEstimate = typeof impactEstimates.$inferSelect;
export type InsertImpactEstimate = typeof impactEstimates.$inferInsert;

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
