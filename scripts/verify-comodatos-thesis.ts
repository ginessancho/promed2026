/**
 * THIRD INDEPENDENT ANALYSIS — Verification of Comodatos Executive Summary
 * 
 * Each claim in the executive summary is verified by its own standalone SQL query.
 * No shared functions, no reused code — each check is auditable independently.
 * 
 * Run: npx tsx scripts/verify-comodatos-thesis.ts
 */
import "dotenv/config";
import { queryRedshift, getRedshiftPool } from "../server/redshift";

interface Claim {
  id: string;
  claim: string;
  threshold: string;
  result?: string;
  pass?: boolean;
}

const claims: Claim[] = [];

function check(id: string, claim: string, threshold: string, actualValue: string, pass: boolean) {
  claims.push({ id, claim, threshold, result: actualValue, pass });
  const icon = pass ? "✅" : "❌";
  console.log(`  ${icon} [${id}] ${claim}`);
  console.log(`     Umbral: ${threshold}`);
  console.log(`     Resultado: ${actualValue}\n`);
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  VERIFICACIÓN INDEPENDIENTE — Tesis Ejecutiva Comodatos");
  console.log("  Fecha: " + new Date().toISOString());
  console.log("═══════════════════════════════════════════════════════════════\n");

  // ─── C1: Total activos comodato y tasa de orfandad global ─────────────
  console.log("─── C1: UNIVERSO DE ACTIVOS COMODATO ──────────────────────────");
  const [c1] = await queryRedshift<{
    total: string; con_contrato: string; sin_contrato: string;
  }>(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN c.equipo_activo IS NOT NULL THEN 1 ELSE 0 END) as con_contrato,
      SUM(CASE WHEN c.equipo_activo IS NULL THEN 1 ELSE 0 END) as sin_contrato
    FROM naf6.arafma a
    LEFT JOIN (SELECT DISTINCT no_cia, equipo_activo FROM naf6.arafcom) c
      ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
    WHERE a.indcomodato = 'S'
  `);
  const totalActivos = parseInt(c1.total);
  const sinContrato = parseInt(c1.sin_contrato);
  const tasaOrfandad = (sinContrato / totalActivos * 100);
  check("C1", 
    `Más del 50% de activos comodato carecen de contrato`,
    ">50% orfandad",
    `${sinContrato} de ${totalActivos} = ${tasaOrfandad.toFixed(1)}%`,
    tasaOrfandad > 50
  );

  // ─── C2: Activos recientes (2021-2024) tienen peor orfandad ──────────
  console.log("─── C2: ORFANDAD EN ACTIVOS RECIENTES (2021-2024) ─────────────");
  const c2rows = await queryRedshift<{
    year_ingreso: string; total: string; orphans: string;
  }>(`
    SELECT
      EXTRACT(YEAR FROM a.f_ingre) as year_ingreso,
      COUNT(*) as total,
      SUM(CASE WHEN c.equipo_activo IS NULL THEN 1 ELSE 0 END) as orphans
    FROM naf6.arafma a
    LEFT JOIN (SELECT DISTINCT no_cia, equipo_activo FROM naf6.arafcom) c
      ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
    WHERE a.indcomodato = 'S'
      AND EXTRACT(YEAR FROM a.f_ingre) BETWEEN 2021 AND 2024
    GROUP BY 1 ORDER BY 1
  `);
  const recentTotal = c2rows.reduce((s, r) => s + parseInt(r.total), 0);
  const recentOrphans = c2rows.reduce((s, r) => s + parseInt(r.orphans), 0);
  const recentPct = recentTotal > 0 ? (recentOrphans / recentTotal * 100) : 0;
  const detail2021_2024 = c2rows.map(r => {
    const t = parseInt(r.total);
    const o = parseInt(r.orphans);
    return `${String(r.year_ingreso).split(".")[0]}: ${o}/${t} (${(o/t*100).toFixed(0)}%)`;
  }).join(", ");
  check("C2",
    `Activos 2021-2024 tienen orfandad > 50%`,
    ">50% en cohorte reciente",
    `${recentOrphans}/${recentTotal} = ${recentPct.toFixed(1)}% — Detalle: ${detail2021_2024}`,
    recentPct > 50
  );

  // ─── C3: Activos viejos (pre-2015) tienen MENOR orfandad ─────────────
  console.log("─── C3: ACTIVOS VIEJOS (PRE-2015) vs RECIENTES ────────────────");
  const [c3old] = await queryRedshift<{ total: string; orphans: string }>(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN c.equipo_activo IS NULL THEN 1 ELSE 0 END) as orphans
    FROM naf6.arafma a
    LEFT JOIN (SELECT DISTINCT no_cia, equipo_activo FROM naf6.arafcom) c
      ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
    WHERE a.indcomodato = 'S'
      AND EXTRACT(YEAR FROM a.f_ingre) < 2015
  `);
  const oldTotal = parseInt(c3old.total);
  const oldOrphans = parseInt(c3old.orphans);
  const oldPct = oldTotal > 0 ? (oldOrphans / oldTotal * 100) : 0;
  check("C3",
    `Activos pre-2015 tienen MENOR orfandad que 2021-2024`,
    `Pre-2015 < ${recentPct.toFixed(0)}% (recientes)`,
    `Pre-2015: ${oldOrphans}/${oldTotal} = ${oldPct.toFixed(1)}% vs Recientes: ${recentPct.toFixed(1)}%`,
    oldPct < recentPct
  );

  // ─── C4: Totalmente depreciados NO son los más huérfanos ─────────────
  console.log("─── C4: DEPRECIACIÓN NO CAUSA ORFANDAD ────────────────────────");
  const [c4full] = await queryRedshift<{ total: string; orphans: string }>(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN c.equipo_activo IS NULL THEN 1 ELSE 0 END) as orphans
    FROM naf6.arafma a
    LEFT JOIN (SELECT DISTINCT no_cia, equipo_activo FROM naf6.arafcom) c
      ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
    WHERE a.indcomodato = 'S'
      AND a.val_original > 0
      AND (a.val_original - COALESCE(a.depacum_valorig, 0)) <= 0
  `);
  const fullDepTotal = parseInt(c4full.total);
  const fullDepOrphans = parseInt(c4full.orphans);
  const fullDepPct = fullDepTotal > 0 ? (fullDepOrphans / fullDepTotal * 100) : 0;
  check("C4",
    `Activos 100% depreciados tienen orfandad < promedio global`,
    `<${tasaOrfandad.toFixed(0)}% (promedio global)`,
    `100% depreciados: ${fullDepOrphans}/${fullDepTotal} = ${fullDepPct.toFixed(1)}% vs Global: ${tasaOrfandad.toFixed(1)}%`,
    fullDepPct < tasaOrfandad
  );

  // ─── C5: Trazabilidad completa < 50% ─────────────────────────────────
  console.log("─── C5: TRAZABILIDAD EN 3 SISTEMAS ────────────────────────────");
  const c5rows = await queryRedshift<{
    segment: string; count: string;
  }>(`
    SELECT
      CASE
        WHEN c.equipo_activo IS NOT NULL AND b.no_activo IS NOT NULL THEN 'completo'
        WHEN c.equipo_activo IS NOT NULL AND b.no_activo IS NULL THEN 'solo_contrato'
        WHEN c.equipo_activo IS NULL AND b.no_activo IS NOT NULL THEN 'solo_base'
        ELSE 'fantasma'
      END as segment,
      COUNT(*) as count
    FROM naf6.arafma a
    LEFT JOIN (SELECT DISTINCT no_cia, equipo_activo FROM naf6.arafcom) c
      ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
    LEFT JOIN (
      SELECT DISTINCT no_cia, no_activo
      FROM inventario.base_instalada_promed
      WHERE tipo_contrato = 'COMODATO'
    ) b ON a.no_cia = b.no_cia AND a.no_acti = b.no_activo
    WHERE a.indcomodato = 'S'
    GROUP BY 1
  `);
  const segMap = Object.fromEntries(c5rows.map(r => [r.segment, parseInt(r.count)]));
  const c5total = Object.values(segMap).reduce((a, b) => a + b, 0);
  const completo = segMap["completo"] || 0;
  const completoPct = c5total > 0 ? (completo / c5total * 100) : 0;
  const fantasma = segMap["fantasma"] || 0;
  const fantPct = c5total > 0 ? (fantasma / c5total * 100) : 0;
  check("C5",
    `Menos del 50% de activos están rastreados en los 3 sistemas`,
    "<50% rastreo completo",
    `Completo: ${completo}/${c5total} = ${completoPct.toFixed(1)}% | Fantasma: ${fantasma} (${fantPct.toFixed(1)}%) | Solo base: ${segMap["solo_base"]||0} | Solo contrato: ${segMap["solo_contrato"]||0}`,
    completoPct < 50
  );

  // ─── C6: El problema es multi-país ───────────────────────────────────
  console.log("─── C6: PROBLEMA MULTI-PAÍS ───────────────────────────────────");
  const c6rows = await queryRedshift<{
    no_cia: string; total: string; orphans: string;
  }>(`
    SELECT
      a.no_cia,
      COUNT(*) as total,
      SUM(CASE WHEN c.equipo_activo IS NULL THEN 1 ELSE 0 END) as orphans
    FROM naf6.arafma a
    LEFT JOIN (SELECT DISTINCT no_cia, equipo_activo FROM naf6.arafcom) c
      ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
    WHERE a.indcomodato = 'S'
    GROUP BY a.no_cia
    HAVING COUNT(*) >= 50
    ORDER BY COUNT(*) DESC
  `);
  const paisesConOrfandadAlta = c6rows.filter(r => {
    const pct = parseInt(r.orphans) / parseInt(r.total) * 100;
    return pct > 30;
  });
  const CIA_NAMES: Record<string, string> = {
    "01": "Panamá", "09": "Honduras(09)", "10": "Honduras(10)",
    "12": "Costa Rica", "15": "Guatemala", "18": "El Salvador",
    "22": "Nicaragua", "24": "Rep. Dominicana", "26": "Colombia",
    "27": "Colombia(27)", "28": "Ecuador", "30": "Panamá(30)",
  };
  const paisDetail = c6rows.map(r => {
    const pct = (parseInt(r.orphans) / parseInt(r.total) * 100).toFixed(0);
    return `${CIA_NAMES[r.no_cia] || r.no_cia}: ${pct}%`;
  }).join(", ");
  check("C6",
    `Al menos 3 países tienen orfandad > 30%`,
    "≥3 países con >30%",
    `${paisesConOrfandadAlta.length} países: ${paisDetail}`,
    paisesConOrfandadAlta.length >= 3
  );

  // ─── RESUMEN ─────────────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════════════════════════");
  const passed = claims.filter(c => c.pass).length;
  const total = claims.length;
  console.log(`  RESULTADO: ${passed}/${total} claims verificados`);
  if (passed === total) {
    console.log("  ✅ TESIS CONFIRMADA — Todas las afirmaciones se sostienen con datos.");
  } else {
    console.log("  ⚠️  TESIS PARCIALMENTE CONFIRMADA — Revisar claims fallidos:");
    claims.filter(c => !c.pass).forEach(c => {
      console.log(`     ❌ ${c.id}: ${c.claim} → ${c.result}`);
    });
  }
  console.log("═══════════════════════════════════════════════════════════════\n");

  // Output structured for copy-paste
  console.log("─── DATOS PARA RESUMEN EJECUTIVO ──────────────────────────────");
  console.log(`Total activos comodato: ${totalActivos}`);
  console.log(`Sin contrato: ${sinContrato} (${tasaOrfandad.toFixed(1)}%)`);
  console.log(`Orfandad 2021-2024: ${recentPct.toFixed(1)}%`);
  console.log(`Orfandad pre-2015: ${oldPct.toFixed(1)}%`);
  console.log(`Orfandad 100% depreciados: ${fullDepPct.toFixed(1)}%`);
  console.log(`Rastreo completo (3 sistemas): ${completoPct.toFixed(1)}%`);
  console.log(`Activos fantasma: ${fantasma} (${fantPct.toFixed(1)}%)`);
  console.log(`Países con orfandad >30%: ${paisesConOrfandadAlta.length}`);

  const pool = getRedshiftPool();
  await pool.end();
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
