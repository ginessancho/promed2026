import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";
import type { TrpcContext } from "../../server/_core/context";

// Use Node.js runtime for libsql/Turso compatibility
export const config = {
  runtime: "nodejs",
  maxDuration: 10,
};

export default async function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: (): TrpcContext => ({
      req: {} as any,
      res: {} as any,
    }),
  });
}

