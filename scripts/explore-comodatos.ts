import "dotenv/config";
import { queryRedshift, getRedshiftPool } from "../server/redshift";

async function main() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  COMODATOS — Part 2: equipo_promed, sys_id, No instalado");
  console.log("═══════════════════════════════════════════════════════════════\n");

  // ─── Q1: equipo_promed flag in ARAFCOM ────────────────────────────────
  console.log("─── Q1: ARAFCOM equipo_promed FLAG ─────────────────────────────");
  console.log("Does this distinguish PROMED-owned vs client equipment?\n");

  const q1 = await queryRedshift<{
    equipo_promed: string | null;
    status: string | null;
    cnt: string;
    valor_original: string;
  }>(`
    SELECT
      c.equipo_promed,
      UPPER(TRIM(c.status)) as status,
      COUNT(*) as cnt,
      COALESCE(SUM(a.val_original), 0) as valor_original
    FROM naf6.arafcom c
    JOIN naf6.arafma a ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo AND a.indcomodato = 'S'
    GROUP BY c.equipo_promed, UPPER(TRIM(c.status))
    ORDER BY COUNT(*) DESC
  `);

  console.table(q1.map(r => ({
    "equipo_promed": r.equipo_promed === null ? '<NULL>' : `"${r.equipo_promed}"`,
    "Status": r.status || '<NULL>',
    "Count": parseInt(r.cnt),
    "Valor Original": `$${(parseFloat(r.valor_original) / 1_000_000).toFixed(2)}M`,
  })));

  // ─── Q2: sys_id in ARAFCOM — what values does it hold? ───────────────
  console.log("\n─── Q2: ARAFCOM sys_id — WHAT VALUES? ─────────────────────────\n");

  const q2 = await queryRedshift<{
    has_sysid: string;
    status: string | null;
    cnt: string;
  }>(`
    SELECT
      CASE WHEN c.sys_id IS NOT NULL AND TRIM(c.sys_id) != '' THEN 'Has sys_id' ELSE 'No sys_id' END as has_sysid,
      UPPER(TRIM(c.status)) as status,
      COUNT(*) as cnt
    FROM naf6.arafcom c
    JOIN naf6.arafma a ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo AND a.indcomodato = 'S'
    GROUP BY 1, UPPER(TRIM(c.status))
    ORDER BY COUNT(*) DESC
  `);

  console.table(q2);

  // ─── Q3: "No instalado" — WHERE are these assets? ────────────────────
  console.log("\n─── Q3: 'NO INSTALADO' — instalado_en breakdown ───────────────");
  console.log("Are they in PROMED bodega or at client sites?\n");

  const q3 = await queryRedshift<{
    instalado_en_category: string;
    cnt: string;
    valor_original: string;
    has_cliente: string;
  }>(`
    SELECT
      CASE
        WHEN c.instalado_en IS NULL OR TRIM(c.instalado_en) = '' THEN '<sin ubicación>'
        WHEN UPPER(TRIM(c.instalado_en)) LIKE '%PROMED%' THEN 'En PROMED (bodega/interno)'
        ELSE 'En Cliente/Hospital'
      END as instalado_en_category,
      COUNT(*) as cnt,
      COALESCE(SUM(a.val_original), 0) as valor_original,
      SUM(CASE WHEN c.cliente IS NOT NULL AND TRIM(c.cliente) != '' THEN 1 ELSE 0 END) as has_cliente
    FROM naf6.arafcom c
    JOIN naf6.arafma a ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo AND a.indcomodato = 'S'
    WHERE UPPER(TRIM(c.status)) = 'NO INSTALADO'
    GROUP BY 1
    ORDER BY COUNT(*) DESC
  `);

  console.table(q3.map(r => ({
    "Ubicación": r.instalado_en_category,
    "Count": parseInt(r.cnt),
    "Valor Original": `$${(parseFloat(r.valor_original) / 1_000_000).toFixed(2)}M`,
    "Con Cliente Asignado": parseInt(r.has_cliente),
  })));

  // ─── Q4: contrato_sysid in ARAFMA — does it match BASE_INSTALADA? ────
  console.log("\n─── Q4: ARAFMA contrato_sysid — MATCHES vs BASE_INSTALADA ─────\n");

  const q4 = await queryRedshift<{
    category: string;
    cnt: string;
  }>(`
    SELECT
      CASE
        WHEN a.contrato_sysid IS NULL OR TRIM(a.contrato_sysid) = '' THEN 'No contrato_sysid'
        WHEN b.sys_id IS NOT NULL THEN 'sysid matches BASE_INSTALADA'
        ELSE 'sysid exists but NO match in BASE_INSTALADA'
      END as category,
      COUNT(*) as cnt
    FROM naf6.arafma a
    LEFT JOIN inventario.base_instalada_promed b ON TRIM(a.contrato_sysid) = TRIM(b.sys_id)
    WHERE a.indcomodato = 'S'
    GROUP BY 1
    ORDER BY COUNT(*) DESC
  `);

  console.table(q4);

  // ─── Q5: ARAFCOM — FULL status × equipo_promed × has_client matrix ───
  console.log("\n─── Q5: COMPLETE STATUS × LOCATION MATRIX ─────────────────────");
  console.log("Understanding the real meaning of each contract status\n");

  const q5 = await queryRedshift<{
    status: string;
    equipo_promed: string | null;
    location: string;
    has_client: string;
    cnt: string;
    valor_original: string;
  }>(`
    SELECT
      UPPER(TRIM(c.status)) as status,
      c.equipo_promed,
      CASE
        WHEN c.instalado_en IS NULL OR TRIM(c.instalado_en) = '' THEN 'Sin ubicacion'
        WHEN UPPER(TRIM(c.instalado_en)) LIKE '%PROMED%' THEN 'PROMED'
        ELSE 'Cliente/Hospital'
      END as location,
      CASE WHEN c.cliente IS NOT NULL AND TRIM(c.cliente) != '' THEN 'Si' ELSE 'No' END as has_client,
      COUNT(*) as cnt,
      COALESCE(SUM(a.val_original), 0) as valor_original
    FROM naf6.arafcom c
    JOIN naf6.arafma a ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo AND a.indcomodato = 'S'
    GROUP BY 1, 2, 3, 4
    ORDER BY COUNT(*) DESC
  `);

  console.table(q5.map(r => ({
    "Status": r.status || '<NULL>',
    "equipo_promed": r.equipo_promed || '<NULL>',
    "Ubicación": r.location,
    "Tiene Cliente": r.has_client,
    "Count": parseInt(r.cnt),
    "Valor Original": `$${(parseFloat(r.valor_original) / 1_000_000).toFixed(2)}M`,
  })));

  // ─── Q6: "No instalado" at PROMED — sample to see what they are ──────
  console.log("\n─── Q6: 'NO INSTALADO' at PROMED — sample rows ────────────────\n");

  const q6 = await queryRedshift<Record<string, string | null>>(`
    SELECT
      c.no_cia, c.equipo_activo, c.no_comodato, c.cod_comodato,
      c.cliente, c.instalado_en, c.equipo_promed, c.sys_id,
      a.descri, a.marca, a.modelo,
      a.val_original, a.contrato_sysid
    FROM naf6.arafcom c
    JOIN naf6.arafma a ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo AND a.indcomodato = 'S'
    WHERE UPPER(TRIM(c.status)) = 'NO INSTALADO'
      AND (c.instalado_en IS NULL OR UPPER(TRIM(c.instalado_en)) LIKE '%PROMED%')
      AND (c.cliente IS NULL OR TRIM(c.cliente) = '')
    ORDER BY a.val_original DESC NULLS LAST
    LIMIT 10
  `);

  console.table(q6);

  // ─── Q7: "No instalado" WITH client — what does it mean? ─────────────
  console.log("\n─── Q7: 'NO INSTALADO' WITH CLIENT — sample rows ──────────────\n");

  const q7 = await queryRedshift<Record<string, string | null>>(`
    SELECT
      c.no_cia, c.equipo_activo, c.no_comodato,
      c.cliente, c.instalado_en, c.equipo_promed, c.sys_id,
      c.fecha_inic, c.fecha_fin,
      a.descri, a.val_original
    FROM naf6.arafcom c
    JOIN naf6.arafma a ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo AND a.indcomodato = 'S'
    WHERE UPPER(TRIM(c.status)) = 'NO INSTALADO'
      AND c.cliente IS NOT NULL AND TRIM(c.cliente) != ''
    ORDER BY a.val_original DESC NULLS LAST
    LIMIT 10
  `);

  console.table(q7);

  // ─── Q8: ARAFCOM — contracts where equipo_activo doesn't match ARAFMA ─
  console.log("\n─── Q8: ARAFCOM contracts WITHOUT matching ARAFMA asset ────────");
  console.log("These are contracts referencing non-comodato or non-existent assets\n");

  const q8 = await queryRedshift<{
    category: string;
    status: string;
    cnt: string;
  }>(`
    SELECT
      CASE
        WHEN a.no_acti IS NULL THEN 'No asset in ARAFMA at all'
        WHEN a.indcomodato != 'S' OR a.indcomodato IS NULL THEN 'Asset exists but NOT comodato'
        ELSE 'Asset IS comodato'
      END as category,
      UPPER(TRIM(c.status)) as status,
      COUNT(*) as cnt
    FROM naf6.arafcom c
    LEFT JOIN naf6.arafma a ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
    GROUP BY 1, 2
    ORDER BY 1, COUNT(*) DESC
  `);

  console.table(q8);

  // ─── Q9: Orphan assets — do they have contrato_sysid pointing to BASE? ─
  console.log("\n─── Q9: ORPHAN contrato_sysid → BASE_INSTALADA lookup ─────────");
  console.log("Can we find orphan assets in base instalada via sysid?\n");

  const q9 = await queryRedshift<{
    category: string;
    cnt: string;
    valor_original: string;
  }>(`
    SELECT
      CASE
        WHEN a.contrato_sysid IS NULL OR TRIM(a.contrato_sysid) = '' THEN 'No sysid'
        WHEN b.sys_id IS NOT NULL THEN 'sysid → found in BASE_INSTALADA'
        WHEN c.sys_id IS NOT NULL THEN 'sysid → found in ARAFCOM (has contract!)'
        ELSE 'sysid → NOT found anywhere'
      END as category,
      COUNT(*) as cnt,
      COALESCE(SUM(a.val_original), 0) as valor_original
    FROM naf6.arafma a
    LEFT JOIN inventario.base_instalada_promed b ON TRIM(a.contrato_sysid) = TRIM(b.sys_id)
    LEFT JOIN (SELECT DISTINCT sys_id, no_cia FROM naf6.arafcom) c ON TRIM(a.contrato_sysid) = TRIM(c.sys_id) AND a.no_cia = c.no_cia
    WHERE a.indcomodato = 'S'
      AND NOT EXISTS (SELECT 1 FROM naf6.arafcom x WHERE x.no_cia = a.no_cia AND x.equipo_activo = a.no_acti)
    GROUP BY 1
    ORDER BY COUNT(*) DESC
  `);

  console.table(q9.map(r => ({
    "Category": r.category,
    "Count": parseInt(r.cnt),
    "Valor Original": `$${(parseFloat(r.valor_original) / 1_000_000).toFixed(2)}M`,
  })));

  // ─── Q10: Orphans WITH sysid — sample to understand ──────────────────
  console.log("\n─── Q10: ORPHAN w/ sysid sample ───────────────────────────────\n");

  const q10 = await queryRedshift<Record<string, string | null>>(`
    SELECT
      a.no_cia, a.no_acti, a.descri, a.contrato_sysid,
      a.val_original, a.centro_costo,
      b.nombre_cliente as base_cliente, b.instalacion as base_instalacion,
      b.est_instal as base_estado
    FROM naf6.arafma a
    LEFT JOIN inventario.base_instalada_promed b ON TRIM(a.contrato_sysid) = TRIM(b.sys_id)
    WHERE a.indcomodato = 'S'
      AND NOT EXISTS (SELECT 1 FROM naf6.arafcom c WHERE c.no_cia = a.no_cia AND c.equipo_activo = a.no_acti)
      AND a.contrato_sysid IS NOT NULL AND TRIM(a.contrato_sysid) != ''
    ORDER BY a.val_original DESC NULLS LAST
    LIMIT 15
  `);

  console.table(q10);

  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("  DONE.");
  console.log("═══════════════════════════════════════════════════════════════");

  const pool = getRedshiftPool();
  await pool.end();
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
