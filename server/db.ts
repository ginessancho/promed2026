import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import Database from "better-sqlite3";
import { createClient } from "@libsql/client";
import { InsertUser, InsertProcessEstimate, ProcessEstimate, InsertProcessDataPoint, ProcessDataPoint, users, processEstimates, processDataPoints, proposalIntro, proposalPhases, InsertProposalIntro, ProposalIntro, InsertProposalPhase, ProposalPhase } from "../drizzle/schema";
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
// Process Estimates
// ═══════════════════════════════════════════════════════════════════════════════

export function listProcessEstimates(): ProcessEstimate[] {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot list process estimates: database not available");
    return [];
  }

  return db.select().from(processEstimates).all();
}

export function getProcessEstimate(id: string): ProcessEstimate | undefined {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot get process estimate: database not available");
    return undefined;
  }

  const result = db.select().from(processEstimates).where(eq(processEstimates.id, id)).limit(1).all();
  return result.length > 0 ? result[0] : undefined;
}

export function upsertProcessEstimate(estimate: InsertProcessEstimate): void {
  if (!estimate.id) {
    throw new Error("Process estimate id is required");
  }

  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert process estimate: database not available");
    return;
  }

  const updateSet: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (estimate.estimatedAnnualLossUSD !== undefined) {
    updateSet.estimatedAnnualLossUSD = estimate.estimatedAnnualLossUSD;
  }
  if (estimate.confidenceLevel !== undefined) {
    updateSet.confidenceLevel = estimate.confidenceLevel;
  }
  if (estimate.assumptions !== undefined) {
    updateSet.assumptions = estimate.assumptions;
  }
  if (estimate.updatedBy !== undefined) {
    updateSet.updatedBy = estimate.updatedBy;
  }

  db.insert(processEstimates).values({
    ...estimate,
    updatedAt: new Date(),
  }).onConflictDoUpdate({
    target: processEstimates.id,
    set: updateSet,
  }).run();
}

// ═══════════════════════════════════════════════════════════════════════════════
// Process Data Points - Individual metrics per process
// ═══════════════════════════════════════════════════════════════════════════════

export function listProcessDataPoints(processId?: string): ProcessDataPoint[] {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot list process data points: database not available");
    return [];
  }

  if (processId) {
    return db.select().from(processDataPoints).where(eq(processDataPoints.processId, processId)).all();
  }
  return db.select().from(processDataPoints).all();
}

export function getProcessDataPoint(id: string): ProcessDataPoint | undefined {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot get process data point: database not available");
    return undefined;
  }

  const result = db.select().from(processDataPoints).where(eq(processDataPoints.id, id)).limit(1).all();
  return result.length > 0 ? result[0] : undefined;
}

export function upsertProcessDataPoint(dataPoint: InsertProcessDataPoint): void {
  if (!dataPoint.id || !dataPoint.processId || !dataPoint.metricKey) {
    throw new Error("Data point id, processId, and metricKey are required");
  }

  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert data point: database not available");
    return;
  }

  const updateSet: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (dataPoint.value !== undefined) {
    updateSet.value = dataPoint.value;
  }
  if (dataPoint.unit !== undefined) {
    updateSet.unit = dataPoint.unit;
  }
  if (dataPoint.source !== undefined) {
    updateSet.source = dataPoint.source;
  }
  if (dataPoint.sourceDetail !== undefined) {
    updateSet.sourceDetail = dataPoint.sourceDetail;
  }
  if (dataPoint.confidenceLevel !== undefined) {
    updateSet.confidenceLevel = dataPoint.confidenceLevel;
  }
  if (dataPoint.updatedBy !== undefined) {
    updateSet.updatedBy = dataPoint.updatedBy;
  }

  db.insert(processDataPoints).values({
    ...dataPoint,
    updatedAt: new Date(),
  }).onConflictDoUpdate({
    target: processDataPoints.id,
    set: updateSet,
  }).run();
}

export function deleteProcessDataPoint(id: string): void {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot delete process data point: database not available");
    return;
  }

  db.delete(processDataPoints).where(eq(processDataPoints.id, id)).run();
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
