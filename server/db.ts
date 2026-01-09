import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { 
  InsertMetricDefinition, MetricDefinition, metricDefinitions,
  InsertBusinessProcess, BusinessProcess, businessProcesses,
  InsertImpactEstimate, ImpactEstimate, impactEstimates,
  proposalIntro, proposalPhases, InsertProposalIntro, ProposalIntro, InsertProposalPhase, ProposalPhase,
  roiModelData, RoiModelData, InsertRoiModelData
} from "../drizzle/schema";

// Use libsql client that works in both serverless (Vercel) and local dev
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    try {
      let url = process.env.DATABASE_URL;
      const authToken = process.env.DATABASE_AUTH_TOKEN;

      if (url) {
        // Production / Turso Mode
        // Convert libsql:// to https:// for HTTP-only compatibility (serverless)
        if (url.startsWith("libsql://")) {
          url = url.replace("libsql://", "https://");
        }
        console.log("[Database] Connecting to Turso...", url.substring(0, 30) + "...");
        const client = createClient({ url, authToken });
        _db = drizzle(client);
      } else {
        // Local Development Mode - use local SQLite file
        console.log("[Database] Connecting to local SQLite...");
        const client = createClient({ url: "file:./data/promed.db" });
        _db = drizzle(client);
      }
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Metric Definitions
// ═══════════════════════════════════════════════════════════════════════════════

export async function listMetricDefinitions(): Promise<MetricDefinition[]> {
  const db = getDb();
  if (!db) return [];
  return db.select().from(metricDefinitions);
}

export async function upsertMetricDefinition(metric: InsertMetricDefinition): Promise<void> {
  const db = getDb();
  if (!db || !metric.id) return;

  const updateSet: Record<string, unknown> = { updatedAt: new Date() };
  if (metric.name) updateSet.name = metric.name;
  if (metric.category) updateSet.category = metric.category;
  if (metric.unit) updateSet.unit = metric.unit;
  if (metric.description) updateSet.description = metric.description;

  await db.insert(metricDefinitions).values({ ...metric, updatedAt: new Date() })
    .onConflictDoUpdate({ target: metricDefinitions.id, set: updateSet });
}

// ═══════════════════════════════════════════════════════════════════════════════
// Business Processes
// ═══════════════════════════════════════════════════════════════════════════════

export async function listBusinessProcesses(): Promise<BusinessProcess[]> {
  const db = getDb();
  if (!db) return [];
  return db.select().from(businessProcesses);
}

export async function upsertBusinessProcess(process: InsertBusinessProcess): Promise<void> {
  const db = getDb();
  if (!db || !process.id) return;

  const updateSet: Record<string, unknown> = { updatedAt: new Date() };
  if (process.name) updateSet.name = process.name;
  if (process.department) updateSet.department = process.department;
  if (process.criticality) updateSet.criticality = process.criticality;
  if (process.description) updateSet.description = process.description;

  await db.insert(businessProcesses).values({ ...process, updatedAt: new Date() })
    .onConflictDoUpdate({ target: businessProcesses.id, set: updateSet });
}

// ═══════════════════════════════════════════════════════════════════════════════
// Impact Estimates
// ═══════════════════════════════════════════════════════════════════════════════

export async function listImpactEstimates(processId?: string): Promise<ImpactEstimate[]> {
  const db = getDb();
  if (!db) return [];

  if (processId) {
    return db.select().from(impactEstimates).where(eq(impactEstimates.processId, processId));
  }
  return db.select().from(impactEstimates);
}

export async function upsertImpactEstimate(estimate: InsertImpactEstimate): Promise<void> {
  const db = getDb();
  if (!db || !estimate.id) return;

  const updateSet: Record<string, unknown> = { updatedAt: new Date() };
  const keys = Object.keys(estimate) as (keyof InsertImpactEstimate)[];
  keys.forEach(key => {
    if (key !== 'id' && estimate[key] !== undefined) {
      updateSet[key] = estimate[key];
    }
  });

  await db.insert(impactEstimates).values({ ...estimate, updatedAt: new Date() })
    .onConflictDoUpdate({ target: impactEstimates.id, set: updateSet });
}

export async function deleteImpactEstimate(id: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await db.delete(impactEstimates).where(eq(impactEstimates.id, id));
}

// ═══════════════════════════════════════════════════════════════════════════════
// Proposal Intro Content
// ═══════════════════════════════════════════════════════════════════════════════

export async function getProposalIntro(): Promise<ProposalIntro | undefined> {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot get proposal intro: database not available");
    return undefined;
  }
  
  const result = await db.select().from(proposalIntro).where(eq(proposalIntro.id, 'default')).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertProposalIntro(intro: InsertProposalIntro): Promise<void> {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert proposal intro: database not available");
    return;
  }

  const values = {
    ...intro,
    id: 'default',
    updatedAt: new Date(),
  };

  await db.insert(proposalIntro).values(values).onConflictDoUpdate({
    target: proposalIntro.id,
    set: values,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// Proposal Phases
// ═══════════════════════════════════════════════════════════════════════════════

export async function listProposalPhases(): Promise<ProposalPhase[]> {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot list proposal phases: database not available");
    return [];
  }
  
  const phases = await db.select().from(proposalPhases);
  return phases.sort((a: ProposalPhase, b: ProposalPhase) => a.order - b.order);
}

export async function upsertProposalPhase(phase: InsertProposalPhase): Promise<void> {
  if (!phase.id) {
    throw new Error("Proposal phase id is required");
  }

  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert proposal phase: database not available");
    return;
  }

  const updateSet: Record<string, unknown> = { updatedAt: new Date() };
  const keys = Object.keys(phase) as (keyof InsertProposalPhase)[];
  keys.forEach(key => {
    if (key !== 'id' && phase[key] !== undefined) {
      updateSet[key] = phase[key];
    }
  });

  await db.insert(proposalPhases).values({
    ...phase,
    updatedAt: new Date(),
  }).onConflictDoUpdate({
    target: proposalPhases.id,
    set: updateSet,
  });
}

export async function deleteProposalPhase(id: string): Promise<void> {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot delete proposal phase: database not available");
    return;
  }
  
  await db.delete(proposalPhases).where(eq(proposalPhases.id, id));
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROI Model Data
// ═══════════════════════════════════════════════════════════════════════════════

export async function getRoiModelData(): Promise<RoiModelData | undefined> {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot get ROI model data: database not available");
    return undefined;
  }
  
  try {
    const result = await db.select().from(roiModelData).where(eq(roiModelData.id, 'default')).limit(1);
    console.log("[ROI Model] Query result:", result?.length, "rows");
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[ROI Model] Error reading data:", error);
    return undefined;
  }
}

export async function upsertRoiModelData(data: Record<string, unknown>, updatedBy?: string): Promise<void> {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert ROI model data: database not available");
    return;
  }

  const values: InsertRoiModelData = {
    id: 'default',
    data: data,
    version: 1,
    updatedAt: new Date(),
    updatedBy: updatedBy ?? null,
  };

  try {
    await db.insert(roiModelData).values(values).onConflictDoUpdate({
      target: roiModelData.id,
      set: {
        data: data,
        updatedAt: new Date(),
        updatedBy: updatedBy ?? null,
      },
    });
    console.log("[ROI Model] Data saved successfully");
  } catch (error) {
    console.error("[ROI Model] Error saving data:", error);
    throw error;
  }
}
