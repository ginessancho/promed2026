import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // Authentication removed as part of Manus removal
  return {
    req: opts.req,
    res: opts.res,
  };
}
