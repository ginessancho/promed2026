/**
 * Serverless tRPC Handler for Vercel
 * 
 * This file is self-contained to avoid bundling issues with native Node.js modules.
 * Uses @libsql/client/web (HTTP client) instead of native bindings.
 */

import { initTRPC } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createClient } from "@libsql/client/web";
// Use driver-core to avoid pulling in native @libsql/client dependencies
import { LibSQLDatabase } from "drizzle-orm/libsql/driver-core";
import { eq } from "drizzle-orm";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { SQLiteAsyncDialect } from "drizzle-orm/sqlite-core/dialect";
import { LibSQLSession } from "drizzle-orm/libsql/session";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════════════════════
// Schema (duplicated to avoid import issues)
// ═══════════════════════════════════════════════════════════════════════════════

const metricDefinitions = sqliteTable("metricDefinitions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category", { enum: ["financial_cost", "financial_benefit", "operational_kpi", "risk_factor"] }).notNull(),
  unit: text("unit", { enum: ["USD", "hours", "count", "percent", "days", "score"] }).notNull(),
  description: text("description"),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

const businessProcesses = sqliteTable("businessProcesses", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  department: text("department").notNull(),
  criticality: text("criticality", { enum: ["low", "medium", "high", "critical"] }).default("medium").notNull(),
  description: text("description"),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

const impactEstimates = sqliteTable("impactEstimates", {
  id: text("id").primaryKey(),
  metricId: text("metricId").notNull().references(() => metricDefinitions.id),
  processId: text("processId").references(() => businessProcesses.id),
  amount: real("amount").notNull(),
  amountMin: real("amountMin"),
  amountMax: real("amountMax"),
  confidence: text("confidence", { enum: ["low", "medium", "high", "confirmed"] }).default("low").notNull(),
  source: text("source"),
  assumptions: text("assumptions"),
  followUpRequired: integer("followUpRequired", { mode: "boolean" }).default(false).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedBy: text("updatedBy"),
});

const proposalIntro = sqliteTable("proposalIntro", {
  id: text("id").primaryKey(),
  title: text("title").notNull().default("Propuesta 2026"),
  subtitle: text("subtitle").notNull().default("Evolución estratégica del ecosistema Odoo"),
  strategicValueTitle: text("strategicValueTitle").notNull().default("Valor Estratégico"),
  strategicValueSubtitle: text("strategicValueSubtitle").notNull().default("Impacto en el Negocio"),
  strategicValueDetail: text("strategicValueDetail").notNull().default("Eficiencia, Precisión y Escalabilidad"),
  timelineTitle: text("timelineTitle").notNull().default("12 Meses"),
  timelineSubtitle: text("timelineSubtitle").notNull().default("Timeline Completo"),
  timelineDetail: text("timelineDetail").notNull().default("Ene - Dic 2026"),
  phasesTitle: text("phasesTitle").notNull().default("5 Fases"),
  phasesSubtitle: text("phasesSubtitle").notNull().default("Taxonomía única"),
  phasesDetail: text("phasesDetail").notNull().default("Valor continuo"),
  visionTitle: text("visionTitle").notNull().default("Visión Estratégica"),
  visionText: text("visionText").notNull().default("Este proyecto representa una evolución natural..."),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedBy: text("updatedBy"),
});

const proposalPhases = sqliteTable("proposalPhases", {
  id: text("id").primaryKey(),
  technicalName: text("technicalName").notNull(),
  conceptName: text("conceptName").notNull(),
  duration: text("duration").notNull(),
  gate: text("gate").notNull(),
  objective: text("objective").notNull(),
  outcome: text("outcome").notNull(),
  deliverables: text("deliverables", { mode: "json" }).notNull(),
  order: integer("order").notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedBy: text("updatedBy"),
});

const roiModelData = sqliteTable("roiModelData", {
  id: text("id").primaryKey(),
  data: text("data", { mode: "json" }).notNull(),
  version: integer("version").default(1).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedBy: text("updatedBy"),
});

// ═══════════════════════════════════════════════════════════════════════════════
// Database Connection (using HTTP client for serverless)
// ═══════════════════════════════════════════════════════════════════════════════

let _db: LibSQLDatabase<Record<string, never>> | null = null;

function getDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    const authToken = process.env.DATABASE_AUTH_TOKEN;
    
    if (!url) {
      console.error("[Serverless DB] DATABASE_URL not configured");
      return null;
    }
    
    console.log("[Serverless DB] Connecting to Turso via HTTP...");
    const client = createClient({ url, authToken });
    
    // Construct drizzle instance using driver-core to avoid native imports
    const dialect = new SQLiteAsyncDialect({ casing: undefined });
    const session = new LibSQLSession(client, dialect, undefined, { logger: undefined }, undefined);
    _db = new LibSQLDatabase("async", dialect, session, undefined);
  }
  return _db;
}

// ═══════════════════════════════════════════════════════════════════════════════
// tRPC Setup
// ═══════════════════════════════════════════════════════════════════════════════

const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

// ═══════════════════════════════════════════════════════════════════════════════
// Router Definition
// ═══════════════════════════════════════════════════════════════════════════════

const appRouter = router({
  system: router({
    health: publicProcedure.query(() => ({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      runtime: "vercel-serverless"
    })),
  }),

  metricDefinitions: router({
    list: publicProcedure.query(async () => {
      const db = getDb();
      if (!db) return [];
      return db.select().from(metricDefinitions);
    }),
    upsert: publicProcedure
      .input(z.object({
        id: z.string(),
        name: z.string(),
        category: z.enum(["financial_cost", "financial_benefit", "operational_kpi", "risk_factor"]),
        unit: z.enum(["USD", "hours", "count", "percent", "days", "score"]),
        description: z.string().optional().nullable(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        if (!db) return { success: false, error: "Database not available" };
        
        const updateSet: Record<string, unknown> = { updatedAt: new Date() };
        if (input.name) updateSet.name = input.name;
        if (input.category) updateSet.category = input.category;
        if (input.unit) updateSet.unit = input.unit;
        if (input.description !== undefined) updateSet.description = input.description;

        await db.insert(metricDefinitions)
          .values({ ...input, description: input.description ?? null, updatedAt: new Date() })
          .onConflictDoUpdate({ target: metricDefinitions.id, set: updateSet });
        return { success: true };
      }),
  }),

  businessProcesses: router({
    list: publicProcedure.query(async () => {
      const db = getDb();
      if (!db) return [];
      return db.select().from(businessProcesses);
    }),
    upsert: publicProcedure
      .input(z.object({
        id: z.string(),
        name: z.string(),
        department: z.string(),
        criticality: z.enum(["low", "medium", "high", "critical"]),
        description: z.string().optional().nullable(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        if (!db) return { success: false, error: "Database not available" };

        const updateSet: Record<string, unknown> = { updatedAt: new Date() };
        if (input.name) updateSet.name = input.name;
        if (input.department) updateSet.department = input.department;
        if (input.criticality) updateSet.criticality = input.criticality;
        if (input.description !== undefined) updateSet.description = input.description;

        await db.insert(businessProcesses)
          .values({ ...input, description: input.description ?? null, updatedAt: new Date() })
          .onConflictDoUpdate({ target: businessProcesses.id, set: updateSet });
        return { success: true };
      }),
  }),

  impactEstimates: router({
    list: publicProcedure
      .input(z.object({ processId: z.string().optional() }).optional())
      .query(async ({ input }) => {
        const db = getDb();
        if (!db) return [];
        
        if (input?.processId) {
          return db.select().from(impactEstimates).where(eq(impactEstimates.processId, input.processId));
        }
        return db.select().from(impactEstimates);
      }),
    upsert: publicProcedure
      .input(z.object({
        id: z.string(),
        metricId: z.string(),
        processId: z.string().optional().nullable(),
        amount: z.number(),
        amountMin: z.number().optional().nullable(),
        amountMax: z.number().optional().nullable(),
        confidence: z.enum(["low", "medium", "high", "confirmed"]),
        source: z.string().optional().nullable(),
        assumptions: z.string().optional().nullable(),
        followUpRequired: z.boolean().optional(),
        updatedBy: z.string().optional().nullable(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        if (!db) return { success: false, error: "Database not available" };

        const updateSet: Record<string, unknown> = { updatedAt: new Date() };
        Object.entries(input).forEach(([key, value]) => {
          if (key !== 'id' && value !== undefined) {
            updateSet[key] = value;
          }
        });

        await db.insert(impactEstimates)
          .values({
            ...input,
            processId: input.processId ?? null,
            amountMin: input.amountMin ?? null,
            amountMax: input.amountMax ?? null,
            source: input.source ?? null,
            assumptions: input.assumptions ?? null,
            followUpRequired: input.followUpRequired ?? false,
            updatedBy: input.updatedBy ?? null,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({ target: impactEstimates.id, set: updateSet });
        return { success: true };
      }),
    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const db = getDb();
        if (!db) return { success: false, error: "Database not available" };
        await db.delete(impactEstimates).where(eq(impactEstimates.id, input.id));
        return { success: true };
      }),
  }),

  proposal: router({
    getIntro: publicProcedure.query(async () => {
      const db = getDb();
      if (!db) return undefined;
      const result = await db.select().from(proposalIntro).where(eq(proposalIntro.id, 'default')).limit(1);
      return result.length > 0 ? result[0] : undefined;
    }),
    updateIntro: publicProcedure
      .input(z.object({
        title: z.string().optional(),
        subtitle: z.string().optional(),
        strategicValueTitle: z.string().optional(),
        strategicValueSubtitle: z.string().optional(),
        strategicValueDetail: z.string().optional(),
        timelineTitle: z.string().optional(),
        timelineSubtitle: z.string().optional(),
        timelineDetail: z.string().optional(),
        phasesTitle: z.string().optional(),
        phasesSubtitle: z.string().optional(),
        phasesDetail: z.string().optional(),
        visionTitle: z.string().optional(),
        visionText: z.string().optional(),
        updatedBy: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        if (!db) return { success: false, error: "Database not available" };

        const values = { ...input, id: 'default', updatedAt: new Date() };
        await db.insert(proposalIntro).values(values as any).onConflictDoUpdate({
          target: proposalIntro.id,
          set: values,
        });
        return { success: true };
      }),

    listPhases: publicProcedure.query(async () => {
      const db = getDb();
      if (!db) return [];
      const phases = await db.select().from(proposalPhases);
      return phases.sort((a, b) => a.order - b.order);
    }),
    upsertPhase: publicProcedure
      .input(z.object({
        id: z.string(),
        technicalName: z.string(),
        conceptName: z.string(),
        duration: z.string(),
        gate: z.string(),
        objective: z.string(),
        outcome: z.string(),
        deliverables: z.array(z.object({
          category: z.string(),
          items: z.array(z.string())
        })),
        order: z.number(),
        updatedBy: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        if (!db) return { success: false, error: "Database not available" };

        const updateSet: Record<string, unknown> = { updatedAt: new Date() };
        Object.entries(input).forEach(([key, value]) => {
          if (key !== 'id' && value !== undefined) {
            updateSet[key] = value;
          }
        });

        await db.insert(proposalPhases)
          .values({ ...input, updatedAt: new Date() } as any)
          .onConflictDoUpdate({ target: proposalPhases.id, set: updateSet });
        return { success: true };
      }),
    deletePhase: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const db = getDb();
        if (!db) return { success: false, error: "Database not available" };
        await db.delete(proposalPhases).where(eq(proposalPhases.id, input.id));
        return { success: true };
      }),
  }),

  roiModel: router({
    get: publicProcedure.query(async () => {
      const db = getDb();
      if (!db) {
        console.warn("[ROI Model] Database not available");
        return null;
      }
      
      try {
        const result = await db.select().from(roiModelData).where(eq(roiModelData.id, 'default')).limit(1);
        console.log("[ROI Model] Query result:", result?.length, "rows");
        return result.length > 0 ? { data: result[0].data, updatedAt: result[0].updatedAt } : null;
      } catch (error) {
        console.error("[ROI Model] Error reading data:", error);
        return null;
      }
    }),
    update: publicProcedure
      .input(z.object({
        data: z.record(z.string(), z.unknown()),
        updatedBy: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = getDb();
        if (!db) return { success: false, error: "Database not available" };

        try {
          await db.insert(roiModelData)
            .values({
              id: 'default',
              data: input.data,
              version: 1,
              updatedAt: new Date(),
              updatedBy: input.updatedBy ?? null,
            })
            .onConflictDoUpdate({
              target: roiModelData.id,
              set: {
                data: input.data,
                updatedAt: new Date(),
                updatedBy: input.updatedBy ?? null,
              },
            });
          console.log("[ROI Model] Data saved successfully");
          return { success: true };
        } catch (error) {
          console.error("[ROI Model] Error saving data:", error);
          return { success: false, error: String(error) };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

// ═══════════════════════════════════════════════════════════════════════════════
// Vercel Serverless Handler (Web Standard Request/Response)
// ═══════════════════════════════════════════════════════════════════════════════

export default async function handler(req: Request): Promise<Response> {
  console.log("[tRPC Handler] Received request:", req.url);
  
  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: () => ({}),
      onError: ({ error, path }) => {
        console.error(`[tRPC Error] ${path}:`, error);
      },
    });
    return response;
  } catch (error) {
    console.error("[tRPC Handler] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
