import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { listProcessEstimates, upsertProcessEstimate, listProcessDataPoints, upsertProcessDataPoint, getProposalIntro, upsertProposalIntro, listProposalPhases, upsertProposalPhase, deleteProposalPhase } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  processEstimates: router({
    list: publicProcedure.query(() => listProcessEstimates()),
    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          estimatedAnnualLossUSD: z.number().nullable().optional(),
          confidenceLevel: z.enum(["confirmed", "estimated", "unknown"]).optional(),
          assumptions: z.string().nullable().optional(),
          updatedBy: z.string().nullable().optional(),
        })
      )
      .mutation(({ input }) => {
        upsertProcessEstimate({
          id: input.id,
          estimatedAnnualLossUSD: input.estimatedAnnualLossUSD ?? null,
          confidenceLevel: input.confidenceLevel,
          assumptions: input.assumptions ?? null,
          updatedBy: input.updatedBy ?? null,
        });
        return { success: true };
      }),
  }),

  processDataPoints: router({
    list: publicProcedure
      .input(z.object({ processId: z.string().optional() }).optional())
      .query(({ input }) => listProcessDataPoints(input?.processId)),
    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          processId: z.string(),
          metricKey: z.string(),
          value: z.number().nullable().optional(),
          unit: z.enum(["USD", "count", "hours", "percent", "days"]),
          source: z.enum(["kawak", "bamboohr", "quicksight", "odoo", "apex", "redshift", "naf", "interview"]).nullable().optional(),
          sourceDetail: z.string().nullable().optional(),
          confidenceLevel: z.enum(["confirmed", "estimated", "unknown"]).optional(),
          updatedBy: z.string().nullable().optional(),
        })
      )
      .mutation(({ input }) => {
        upsertProcessDataPoint({
          id: input.id,
          processId: input.processId,
          metricKey: input.metricKey,
          value: input.value ?? null,
          unit: input.unit,
          source: input.source ?? null,
          sourceDetail: input.sourceDetail ?? null,
          confidenceLevel: input.confidenceLevel,
          updatedBy: input.updatedBy ?? null,
        });
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
