import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { 
  listMetricDefinitions, upsertMetricDefinition,
  listBusinessProcesses, upsertBusinessProcess,
  listImpactEstimates, upsertImpactEstimate, deleteImpactEstimate,
  getProposalIntro, upsertProposalIntro, 
  listProposalPhases, upsertProposalPhase, deleteProposalPhase 
} from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,

  // ROI & Metric Definitions
  metricDefinitions: router({
    list: publicProcedure.query(() => listMetricDefinitions()),
    upsert: publicProcedure
      .input(z.object({
        id: z.string(),
        name: z.string(),
        category: z.enum(["financial_cost", "financial_benefit", "operational_kpi", "risk_factor"]),
        unit: z.enum(["USD", "hours", "count", "percent", "days", "score"]),
        description: z.string().optional().nullable(),
      }))
      .mutation(({ input }) => {
        upsertMetricDefinition({
          ...input,
          description: input.description ?? null,
        });
        return { success: true };
      }),
  }),

  // Business Processes
  businessProcesses: router({
    list: publicProcedure.query(() => listBusinessProcesses()),
    upsert: publicProcedure
      .input(z.object({
        id: z.string(),
        name: z.string(),
        department: z.string(),
        criticality: z.enum(["low", "medium", "high", "critical"]),
        description: z.string().optional().nullable(),
      }))
      .mutation(({ input }) => {
        upsertBusinessProcess({
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
      .query(({ input }) => listImpactEstimates(input?.processId)),
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
      .mutation(({ input }) => {
        upsertImpactEstimate({
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
      .mutation(({ input }) => {
        deleteImpactEstimate(input.id);
        return { success: true };
      }),
  }),

  proposal: router({
    getIntro: publicProcedure.query(() => getProposalIntro()),
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
      .mutation(({ input }) => {
        upsertProposalIntro({
          id: 'default',
          ...input
        });
        return { success: true };
      }),

    listPhases: publicProcedure.query(() => listProposalPhases()),
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
      .mutation(({ input }) => {
        upsertProposalPhase(input);
        return { success: true };
      }),
    deletePhase: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => {
        deleteProposalPhase(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

