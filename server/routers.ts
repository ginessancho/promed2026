import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { 
  listMetricDefinitions, upsertMetricDefinition,
  listBusinessProcesses, upsertBusinessProcess,
  listImpactEstimates, upsertImpactEstimate, deleteImpactEstimate,
  getProposalIntro, upsertProposalIntro, 
  listProposalPhases, upsertProposalPhase, deleteProposalPhase,
  getRoiModelData, upsertRoiModelData
} from "./db";
import {
  getComodatoSummary, getActivosComodato, getComodatosPorCompania,
  getComodatosPorEstado, getActivosHuerfanos, getBaseInstaladaComodatos,
  getBaseInstaladaSinActivo, getDepreciacionDistribucion, getCohortesEdad,
  getTrazabilidad, getStatusDetallado, getOrphanRecovery,
} from "./comodatos";
import {
  getCachedSummary, getCachedPorCompania, getCachedPorEstado,
  getCachedHuerfanos, getCachedActivos, getCachedBaseInstalada,
  getCachedBaseInstaladaSinActivo, getCachedDepreciacion, getCachedCohortes,
  getCachedTrazabilidad, getCachedStatusDetallado, getCachedOrphanRecovery,
  getCacheStatus, refreshAllCaches,
} from "./comodatos-cache";
import { z } from "zod";

// Helper: always try cache first (instant), only fall back to Redshift if cache is empty
const hasRedshift = !!(process.env.PROMED_AWS_URL && process.env.PROMED_AWS_PASSWORD);

async function withCacheFallback<T>(
  redshiftFn: () => Promise<T>,
  cacheFn: () => Promise<{ data: T; updatedAt: Date } | null>,
): Promise<{ data: T; fromCache: boolean; cacheDate: Date | null }> {
  // Always try cache first — fast, works everywhere
  const cached = await cacheFn();
  if (cached) {
    return { data: cached.data, fromCache: true, cacheDate: cached.updatedAt };
  }
  // Cache empty — try Redshift as fallback (only works on whitelisted IPs)
  if (hasRedshift) {
    try {
      const data = await redshiftFn();
      return { data, fromCache: false, cacheDate: null };
    } catch (err) {
      console.warn("[Comodatos] Redshift failed and cache is empty:", err);
    }
  }
  throw new Error("No data available — cache is empty and Redshift is not accessible. Run: npx tsx scripts/refresh-comodatos.ts");
}

export const appRouter = router({
  system: systemRouter,

  // ROI & Metric Definitions
  metricDefinitions: router({
    list: publicProcedure.query(async () => listMetricDefinitions()),
    upsert: publicProcedure
      .input(z.object({
        id: z.string(),
        name: z.string(),
        category: z.enum(["financial_cost", "financial_benefit", "operational_kpi", "risk_factor"]),
        unit: z.enum(["USD", "hours", "count", "percent", "days", "score"]),
        description: z.string().optional().nullable(),
      }))
      .mutation(async ({ input }) => {
        await upsertMetricDefinition({
          ...input,
          description: input.description ?? null,
        });
        return { success: true };
      }),
  }),

  // Business Processes
  businessProcesses: router({
    list: publicProcedure.query(async () => listBusinessProcesses()),
    upsert: publicProcedure
      .input(z.object({
        id: z.string(),
        name: z.string(),
        department: z.string(),
        criticality: z.enum(["low", "medium", "high", "critical"]),
        description: z.string().optional().nullable(),
      }))
      .mutation(async ({ input }) => {
        await upsertBusinessProcess({
          ...input,
          description: input.description ?? null,
        });
        return { success: true };
      }),
  }),

  // Impact Estimates (Data Points)
  impactEstimates: router({
    list: publicProcedure
      .input(z.object({ processId: z.string().optional() }).optional())
      .query(async ({ input }) => listImpactEstimates(input?.processId)),
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
        await upsertImpactEstimate({
          id: input.id,
          metricId: input.metricId,
          processId: input.processId ?? null,
          amount: input.amount,
          amountMin: input.amountMin ?? null,
          amountMax: input.amountMax ?? null,
          confidence: input.confidence,
          source: input.source ?? null,
          assumptions: input.assumptions ?? null,
          followUpRequired: input.followUpRequired ?? false,
          updatedBy: input.updatedBy ?? null,
        });
        return { success: true };
      }),
    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteImpactEstimate(input.id);
        return { success: true };
      }),
  }),

  proposal: router({
    getIntro: publicProcedure.query(async () => getProposalIntro()),
    updateIntro: publicProcedure
      .input(
        z.object({
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
        })
      )
      .mutation(async ({ input }) => {
        await upsertProposalIntro({
          id: 'default',
          ...input
        });
        return { success: true };
      }),

    listPhases: publicProcedure.query(async () => listProposalPhases()),
    upsertPhase: publicProcedure
      .input(
        z.object({
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
        })
      )
      .mutation(async ({ input }) => {
        await upsertProposalPhase(input);
        return { success: true };
      }),
    deletePhase: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteProposalPhase(input.id);
        return { success: true };
      }),
  }),

  // Comodatos & Activos - Cache-first (Turso), falls back to Redshift when available
  comodatos: router({
    summary: publicProcedure.query(async () => {
      const result = await withCacheFallback(getComodatoSummary, getCachedSummary);
      return { ...result.data, _fromCache: result.fromCache, _cacheDate: result.cacheDate };
    }),
    activos: publicProcedure
      .input(z.object({
        cia: z.string().optional(),
        soloHuerfanos: z.boolean().optional(),
        search: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        const { cia, soloHuerfanos, search, limit = 25, offset = 0 } = input ?? {};
        const cached = await getCachedActivos();
        if (!cached) throw new Error("No activos data — run refresh from local.");
        let rows = cached.data.rows;
        if (cia) rows = rows.filter(r => r.no_cia === cia);
        if (soloHuerfanos) rows = rows.filter(r => !r.no_comodato);
        if (search) {
          const term = search.toLowerCase();
          rows = rows.filter(r =>
            r.descri?.toLowerCase().includes(term) ||
            r.no_acti?.toLowerCase().includes(term) ||
            r.cliente?.toLowerCase().includes(term) ||
            r.no_comodato?.toLowerCase().includes(term) ||
            r.marca?.toLowerCase().includes(term) ||
            r.modelo?.toLowerCase().includes(term)
          );
        }
        const total = rows.length;
        return { rows: rows.slice(offset, offset + limit), total };
      }),
    porCompania: publicProcedure.query(async () => {
      const result = await withCacheFallback(getComodatosPorCompania, getCachedPorCompania);
      return result.data;
    }),
    porEstado: publicProcedure.query(async () => {
      const result = await withCacheFallback(getComodatosPorEstado, getCachedPorEstado);
      return result.data;
    }),
    huerfanos: publicProcedure
      .input(z.object({
        cia: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        const { cia, search, limit = 25, offset = 0 } = input ?? {};
        const cached = await getCachedHuerfanos();
        if (!cached) throw new Error("No huerfanos data — run refresh from local.");
        let rows = cached.data.rows;
        if (cia) rows = rows.filter(r => r.no_cia === cia);
        if (search) {
          const term = search.toLowerCase();
          rows = rows.filter(r =>
            r.descri?.toLowerCase().includes(term) ||
            r.no_acti?.toLowerCase().includes(term) ||
            r.marca?.toLowerCase().includes(term) ||
            r.modelo?.toLowerCase().includes(term)
          );
        }
        const total = rows.length;
        return { rows: rows.slice(offset, offset + limit), total };
      }),
    baseInstalada: publicProcedure
      .input(z.object({
        cia: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        const { cia, limit = 25, offset = 0 } = input ?? {};
        const cached = await getCachedBaseInstalada();
        if (!cached) throw new Error("No base instalada data — run refresh from local.");
        let rows = cached.data.rows;
        if (cia) rows = rows.filter(r => r.no_cia === cia);
        const total = rows.length;
        return { rows: rows.slice(offset, offset + limit), total };
      }),
    baseInstaladaSinActivo: publicProcedure
      .input(z.object({
        cia: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        const { cia, limit = 25, offset = 0 } = input ?? {};
        const cached = await getCachedBaseInstaladaSinActivo();
        if (!cached) throw new Error("No base instalada sin activo data — run refresh from local.");
        let rows = cached.data.rows;
        if (cia) rows = rows.filter(r => r.no_cia === cia);
        const total = rows.length;
        return { rows: rows.slice(offset, offset + limit), total };
      }),

    // Analytical endpoints
    depreciacion: publicProcedure.query(async () => {
      const result = await withCacheFallback(getDepreciacionDistribucion, getCachedDepreciacion);
      return result.data;
    }),
    cohortes: publicProcedure.query(async () => {
      const result = await withCacheFallback(getCohortesEdad, getCachedCohortes);
      return result.data;
    }),
    trazabilidad: publicProcedure.query(async () => {
      const result = await withCacheFallback(getTrazabilidad, getCachedTrazabilidad);
      return result.data;
    }),
    statusDetallado: publicProcedure.query(async () => {
      const result = await withCacheFallback(getStatusDetallado, getCachedStatusDetallado);
      return result.data;
    }),
    orphanRecovery: publicProcedure.query(async () => {
      const result = await withCacheFallback(getOrphanRecovery, getCachedOrphanRecovery);
      return result.data;
    }),

    // Cache management
    cacheStatus: publicProcedure.query(async () => getCacheStatus()),
    refresh: publicProcedure
      .input(z.object({ secret: z.string() }))
      .mutation(async ({ input }) => {
        const expected = process.env.COMODATOS_REFRESH_SECRET || "promed-refresh-2026";
        if (input.secret !== expected) throw new Error("Invalid refresh secret");
        if (!hasRedshift) throw new Error("Redshift not configured — can only refresh from local dev");
        return refreshAllCaches();
      }),
  }),

  // ROI Model for NAF → NetSuite transition
  roiModel: router({
    get: publicProcedure.query(async () => {
      const result = await getRoiModelData();
      return result ? { data: result.data, updatedAt: result.updatedAt } : null;
    }),
    update: publicProcedure
      .input(z.object({
        data: z.record(z.string(), z.unknown()),
        updatedBy: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await upsertRoiModelData(input.data, input.updatedBy);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
