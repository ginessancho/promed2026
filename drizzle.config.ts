import { defineConfig } from "drizzle-kit";

// Load environment variables (Next.js handles this automatically during build)
const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: databaseUrl
    ? {
        url: databaseUrl,
        authToken: process.env.DATABASE_AUTH_TOKEN,
      }
    : {
        url: "file:./data/promed.db",
      },
});
