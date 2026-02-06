import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { comodatosCache } from "../drizzle/schema";
import {
  getComodatoSummary,
  getActivosComodato,
  getComodatosPorCompania,
  getComodatosPorEstado,
  getActivosHuerfanos,
  getBaseInstaladaComodatos,
  getBaseInstaladaSinActivo,
  getDepreciacionDistribucion,
  getCohortesEdad,
  getTrazabilidad,
  getStatusDetallado,
  getOrphanRecovery,
  type ComodatoSummary,
  type ComodatoPorCompania,
  type ComodatoPorEstado,
  type ActivoHuerfano,
  type ActivoComodato,
  type BaseInstaladaComodato,
  type DepreciacionBand,
  type CohorteEdad,
  type TrazabilidadSegment,
  type StatusDetallado,
  type OrphanRecoveryData,
} from "./comodatos";

// ═══════════════════════════════════════════════════════════════════════════════
// Cache Read — reads JSON snapshots from Turso/SQLite
// ═══════════════════════════════════════════════════════════════════════════════

async function readCache<T>(key: string): Promise<{ data: T; updatedAt: Date } | null> {
  const db = getDb();
  if (!db) return null;

  try {
    const rows = await db
      .select()
      .from(comodatosCache)
      .where(eq(comodatosCache.key, key))
      .limit(1);

    if (rows.length === 0) return null;

    return {
      data: rows[0].data as T,
      updatedAt: rows[0].updatedAt,
    };
  } catch (err) {
    console.warn(`[Cache] Failed to read '${key}':`, err);
    return null;
  }
}

async function writeCache(key: string, data: unknown, rowCount: number): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  await db
    .insert(comodatosCache)
    .values({ key, data, rowCount, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: comodatosCache.key,
      set: { data, rowCount, updatedAt: new Date() },
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// Cached Query Functions — try cache first, return null if not available
// (on Vercel without Redshift, these are the only source)
// ═══════════════════════════════════════════════════════════════════════════════

export async function getCachedSummary(): Promise<{ data: ComodatoSummary; updatedAt: Date } | null> {
  return readCache<ComodatoSummary>("summary");
}

export async function getCachedPorCompania(): Promise<{ data: ComodatoPorCompania[]; updatedAt: Date } | null> {
  return readCache<ComodatoPorCompania[]>("porCompania");
}

export async function getCachedPorEstado(): Promise<{ data: ComodatoPorEstado[]; updatedAt: Date } | null> {
  return readCache<ComodatoPorEstado[]>("porEstado");
}

export async function getCachedHuerfanos(): Promise<{ data: { rows: ActivoHuerfano[]; total: number }; updatedAt: Date } | null> {
  return readCache<{ rows: ActivoHuerfano[]; total: number }>("huerfanos");
}

export async function getCachedActivos(): Promise<{ data: { rows: ActivoComodato[]; total: number }; updatedAt: Date } | null> {
  return readCache<{ rows: ActivoComodato[]; total: number }>("activos");
}

export async function getCachedBaseInstalada(): Promise<{ data: { rows: BaseInstaladaComodato[]; total: number }; updatedAt: Date } | null> {
  return readCache<{ rows: BaseInstaladaComodato[]; total: number }>("baseInstalada");
}

export async function getCachedBaseInstaladaSinActivo(): Promise<{ data: { rows: BaseInstaladaComodato[]; total: number }; updatedAt: Date } | null> {
  return readCache<{ rows: BaseInstaladaComodato[]; total: number }>("baseInstaladaSinActivo");
}

export async function getCachedDepreciacion(): Promise<{ data: DepreciacionBand[]; updatedAt: Date } | null> {
  return readCache<DepreciacionBand[]>("depreciacion");
}

export async function getCachedCohortes(): Promise<{ data: CohorteEdad[]; updatedAt: Date } | null> {
  return readCache<CohorteEdad[]>("cohortes");
}

export async function getCachedTrazabilidad(): Promise<{ data: TrazabilidadSegment[]; updatedAt: Date } | null> {
  return readCache<TrazabilidadSegment[]>("trazabilidad");
}

export async function getCachedStatusDetallado(): Promise<{ data: StatusDetallado[]; updatedAt: Date } | null> {
  return readCache<StatusDetallado[]>("statusDetallado");
}

export async function getCachedOrphanRecovery(): Promise<{ data: OrphanRecoveryData; updatedAt: Date } | null> {
  return readCache<OrphanRecoveryData>("orphanRecovery");
}

// ═══════════════════════════════════════════════════════════════════════════════
// Cache Metadata — check freshness
// ═══════════════════════════════════════════════════════════════════════════════

export async function getCacheStatus(): Promise<{ key: string; rowCount: number; updatedAt: Date }[]> {
  const db = getDb();
  if (!db) return [];

  const rows = await db.select({
    key: comodatosCache.key,
    rowCount: comodatosCache.rowCount,
    updatedAt: comodatosCache.updatedAt,
  }).from(comodatosCache);

  return rows;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Refresh — pulls fresh data from Redshift and writes to Turso cache
// Call this from your local machine (which has Redshift access via NordVPN)
// ═══════════════════════════════════════════════════════════════════════════════

export async function refreshAllCaches(): Promise<{ results: { key: string; rowCount: number; ms: number }[]; totalMs: number }> {
  const startTotal = Date.now();
  const results: { key: string; rowCount: number; ms: number }[] = [];

  async function refreshOne(key: string, fn: () => Promise<unknown>, countFn: (d: unknown) => number) {
    const start = Date.now();
    console.log(`[Cache] Refreshing '${key}'...`);
    const data = await fn();
    const rowCount = countFn(data);
    await writeCache(key, data, rowCount);
    const ms = Date.now() - start;
    console.log(`[Cache] '${key}' done — ${rowCount} rows in ${ms}ms`);
    results.push({ key, rowCount, ms });
  }

  // Fetch ALL data from Redshift (no pagination limits — we want the full dataset)
  await refreshOne("summary", getComodatoSummary, () => 1);
  await refreshOne("porCompania", getComodatosPorCompania, (d) => (d as unknown[]).length);
  await refreshOne("porEstado", getComodatosPorEstado, (d) => (d as unknown[]).length);

  // For paginated endpoints, fetch ALL rows (large limit, no offset)
  await refreshOne(
    "huerfanos",
    () => getActivosHuerfanos({ limit: 100_000, offset: 0 }),
    (d) => (d as { total: number }).total
  );
  await refreshOne(
    "activos",
    () => getActivosComodato({ limit: 100_000, offset: 0 }),
    (d) => (d as { total: number }).total
  );
  await refreshOne(
    "baseInstalada",
    () => getBaseInstaladaComodatos({ limit: 100_000, offset: 0 }),
    (d) => (d as { total: number }).total
  );
  await refreshOne(
    "baseInstaladaSinActivo",
    () => getBaseInstaladaSinActivo({ limit: 100_000, offset: 0 }),
    (d) => (d as { total: number }).total
  );

  // Analytical datasets
  await refreshOne("depreciacion", getDepreciacionDistribucion, (d) => (d as unknown[]).length);
  await refreshOne("cohortes", getCohortesEdad, (d) => (d as unknown[]).length);
  await refreshOne("trazabilidad", getTrazabilidad, (d) => (d as unknown[]).length);
  await refreshOne("statusDetallado", getStatusDetallado, (d) => (d as unknown[]).length);
  await refreshOne("orphanRecovery", getOrphanRecovery, (d) => {
    const r = d as OrphanRecoveryData;
    return r.summary.length + r.topClients.length;
  });

  return { results, totalMs: Date.now() - startTotal };
}
