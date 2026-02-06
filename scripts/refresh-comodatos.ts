/**
 * Refresh Comodatos Cache
 * 
 * Run from your local machine (with NordVPN connected for Redshift access):
 *   npx tsx scripts/refresh-comodatos.ts
 * 
 * This pulls fresh data from Redshift and writes it to Turso (cache).
 * The deployed Vercel app then reads from this cache — no Redshift needed.
 */

import "dotenv/config";
import { refreshAllCaches } from "../server/comodatos-cache";

async function main() {
  console.log("╔═══════════════════════════════════════════════╗");
  console.log("║   Refresh Comodatos Cache (Redshift → Turso)  ║");
  console.log("╚═══════════════════════════════════════════════╝");
  console.log();

  if (!process.env.PROMED_AWS_URL) {
    console.error("❌ PROMED_AWS_URL not set. Check your .env file.");
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL;
  console.log(`📡 Redshift: ${process.env.PROMED_AWS_URL?.substring(0, 40)}...`);
  console.log(`💾 Target:   ${dbUrl ? dbUrl.substring(0, 40) + "..." : "Local SQLite (./data/promed.db)"}`);
  console.log();

  try {
    const result = await refreshAllCaches();

    console.log();
    console.log("═══════════════════════════════════════════════");
    console.log("✅ Cache refreshed successfully!");
    console.log();
    for (const r of result.results) {
      console.log(`   ${r.key.padEnd(25)} ${String(r.rowCount).padStart(6)} rows  (${(r.ms / 1000).toFixed(1)}s)`);
    }
    console.log();
    console.log(`   Total: ${(result.totalMs / 1000).toFixed(1)}s`);
    console.log("═══════════════════════════════════════════════");
  } catch (err) {
    console.error("❌ Refresh failed:", err);
    process.exit(1);
  }

  process.exit(0);
}

main();
