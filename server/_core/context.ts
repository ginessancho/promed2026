/**
 * tRPC Context - works with both Express and Next.js (fetch adapter)
 * In serverless mode, req/res are not available, so we use an empty context.
 */

export type TrpcContext = {
  // Empty context for now - can be extended for auth, etc.
};

export async function createContext(): Promise<TrpcContext> {
  return {};
}
