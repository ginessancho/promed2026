import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import Database from "better-sqlite3";
import { createClient } from "@libsql/client";
import { 
  InsertUser, users, 
  InsertMetricDefinition, MetricDefinition, metricDefinitions,
  InsertBusinessProcess, BusinessProcess, businessProcesses,
  InsertImpactEstimate, ImpactEstimate, impactEstimates,
  proposalIntro, proposalPhases, InsertProposalIntro, ProposalIntro, InsertProposalPhase, ProposalPhase 
} from "../drizzle/schema";
import { ENV } from './_core/env';
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

const DB_PATH = "./data/promed.db";

// Use any to support both BetterSQLite3 and LibSQL instances
let _db: any = null;

// Lazily create the drizzle instance.
export function getDb() {
  if (!_db) {
    try {
      if (process.env.DATABASE_URL) {
        // Production / Turso Mode
        console.log("[Database] Connecting to Turso/LibSQL...");
        const client = createClient({
          url: process.env.DATABASE_URL,
          authToken: process.env.DATABASE_AUTH_TOKEN,
        });
        _db = drizzleLibsql(client);
      } else {
        // Local Development Mode
        console.log("[Database] Connecting to local SQLite...");
        const dir = dirname(DB_PATH);
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
        
        const sqlite = new Database(DB_PATH);
        _db = drizzle(sqlite);
      }
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    }).run();
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = db.select().from(users).where(eq(users.openId, openId)).limit(1).all();

  return result.length > 0 ? result[0] : undefined;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Metric Definitions
// ═══════════════════════════════════════════════════════════════════════════════

export function listMetricDefinitions(): MetricDefinition[] {
  const db = getDb();
  if (!db) return [];
  return db.select().from(metricDefinitions).all();
}

export function upsertMetricDefinition(metric: InsertMetricDefinition): void {
  const db = getDb();
  if (!db || !metric.id) return;

  const updateSet: Record<string, unknown> = { updatedAt: new Date() };
  if (metric.name) updateSet.name = metric.name;
  if (metric.category) updateSet.category = metric.category;
  if (metric.unit) updateSet.unit = metric.unit;
  if (metric.description) updateSet.description = metric.description;

  db.insert(metricDefinitions).values({ ...metric, updatedAt: new Date() })
    .onConflictDoUpdate({ target: metricDefinitions.id, set: updateSet }).run();
}

// ═══════════════════════════════════════════════════════════════════════════════
// Business Processes
// ═══════════════════════════════════════════════════════════════════════════════

export function listBusinessProcesses(): BusinessProcess[] {
  const db = getDb();
  if (!db) return [];
  return db.select().from(businessProcesses).all();
}

export function upsertBusinessProcess(process: InsertBusinessProcess): void {
  const db = getDb();
  if (!db || !process.id) return;

  const updateSet: Record<string, unknown> = { updatedAt: new Date() };
  if (process.name) updateSet.name = process.name;
  if (process.department) updateSet.department = process.department;
  if (process.criticality) updateSet.criticality = process.criticality;
  if (process.description) updateSet.description = process.description;

  db.insert(businessProcesses).values({ ...process, updatedAt: new Date() })
    .onConflictDoUpdate({ target: businessProcesses.id, set: updateSet }).run();
}

// ═══════════════════════════════════════════════════════════════════════════════
// Impact Estimates
// ═══════════════════════════════════════════════════════════════════════════════

export function listImpactEstimates(processId?: string): ImpactEstimate[] {
  const db = getDb();
  if (!db) return [];

  if (processId) {
    return db.select().from(impactEstimates).where(eq(impactEstimates.processId, processId)).all();
  }
  return db.select().from(impactEstimates).all();
}

export function upsertImpactEstimate(estimate: InsertImpactEstimate): void {
  const db = getDb();
  if (!db || !estimate.id) return;

  const updateSet: Record<string, unknown> = { updatedAt: new Date() };
  // Only update fields provided
  const keys = Object.keys(estimate) as (keyof InsertImpactEstimate)[];
  keys.forEach(key => {
    if (key !== 'id' && estimate[key] !== undefined) {
      updateSet[key] = estimate[key];
    }
  });

  db.insert(impactEstimates).values({ ...estimate, updatedAt: new Date() })
    .onConflictDoUpdate({ target: impactEstimates.id, set: updateSet }).run();
}

export function deleteImpactEstimate(id: string): void {
  const db = getDb();
  if (!db) return;
  db.delete(impactEstimates).where(eq(impactEstimates.id, id)).run();
}


// ═══════════════════════════════════════════════════════════════════════════════
// Proposal Intro Content
// ═══════════════════════════════════════════════════════════════════════════════

export function getProposalIntro(): ProposalIntro | undefined {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot get proposal intro: database not available");
    return undefined;
  }
  
  // We assume a single row with id='default'
  const result = db.select().from(proposalIntro).where(eq(proposalIntro.id, 'default')).limit(1).all();
  return result.length > 0 ? result[0] : undefined;
}

export function upsertProposalIntro(intro: InsertProposalIntro): void {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert proposal intro: database not available");
    return;
  }

  const values = {
    ...intro,
    id: 'default', // Enforce singleton
    updatedAt: new Date(),
  };

  db.insert(proposalIntro).values(values).onConflictDoUpdate({
    target: proposalIntro.id,
    set: values,
  }).run();
}

// ═══════════════════════════════════════════════════════════════════════════════
// Proposal Phases
// ═══════════════════════════════════════════════════════════════════════════════

export function listProposalPhases(): ProposalPhase[] {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot list proposal phases: database not available");
    return [];
  }
  
  const phases = db.select().from(proposalPhases).all();
  // Sort by order in memory to avoid import complexity
  return phases.sort((a: ProposalPhase, b: ProposalPhase) => a.order - b.order);
}

export function upsertProposalPhase(phase: InsertProposalPhase): void {
  if (!phase.id) {
    throw new Error("Proposal phase id is required");
  }

  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert proposal phase: database not available");
    return;
  }

  const updateSet: Record<string, unknown> = {
    updatedAt: new Date(),
  };
  
  // Dynamic update set construction
  const keys = Object.keys(phase) as (keyof InsertProposalPhase)[];
  keys.forEach(key => {
      if (key !== 'id' && phase[key] !== undefined) {
          updateSet[key] = phase[key];
      }
  });

  db.insert(proposalPhases).values({
    ...phase,
    updatedAt: new Date(),
  }).onConflictDoUpdate({
    target: proposalPhases.id,
    set: updateSet,
  }).run();
}

export function deleteProposalPhase(id: string): void {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot delete proposal phase: database not available");
    return;
  }
  
  db.delete(proposalPhases).where(eq(proposalPhases.id, id)).run();
}
