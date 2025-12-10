import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  console.log("Connected to:", process.env.DATABASE_URL);

  const tablesResult = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__drizzle_%';");
  const tables = tablesResult.rows.map(r => r.name as string);
  console.log("Tables:", tables);

  // Check users count
  if (tables.includes("users")) {
    const userCount = await client.execute("SELECT COUNT(*) as count FROM users");
    console.log("User count:", userCount.rows[0].count);
  }

  // Drop tables
  for (const table of tables) {
     try {
       await client.execute(`DROP TABLE IF EXISTS "${table}"`);
       console.log(`Dropped ${table}`);
     } catch (e) {
       console.log(`Failed to drop ${table}:`, e);
     }
  }
  
  // Also drop the migrations table to reset history
  try {
    await client.execute(`DROP TABLE IF EXISTS "__drizzle_migrations"`);
    console.log(`Dropped __drizzle_migrations`);
  } catch (e) {
    console.log(`Failed to drop __drizzle_migrations:`, e);
  }
}

main().catch(console.error);
