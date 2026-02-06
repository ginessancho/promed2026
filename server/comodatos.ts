import { queryRedshift } from "./redshift";

// ═══════════════════════════════════════════════════════════════════════════════
// Comodatos & Activos - Query functions against Redshift (NAF6 + INVENTARIO)
// ═══════════════════════════════════════════════════════════════════════════════

export interface ComodatoSummary {
  totalActivos: number;
  totalComodatos: number;
  activosConComodato: number;
  activosSinComodato: number;
  instalados: number;
  noInstalados: number;
  valorTotalOriginal: number;
  valorTotalDepreciado: number;
  baseInstaladaComodatos: number;
}

export interface ActivoComodato {
  no_cia: string;
  no_acti: string;
  descri: string;
  marca: string | null;
  modelo: string | null;
  serie: string | null;
  val_original: number;
  dep_acum: number;
  val_neto: number;
  indcomodato: string;
  contrato_sysid: string | null;
  no_comodato: string | null;
  cod_comodato: string | null;
  cliente: string | null;
  com_status: string | null;
  fecha_inic: string | null;
  fecha_fin: string | null;
  monto_mensual: number | null;
  instalado_en: string | null;
  tipo_contrato: string | null;
  f_ingre: string | null;
  centro_costo: string | null;
}

export interface ComodatoPorCompania {
  no_cia: string;
  total_activos: number;
  con_comodato: number;
  sin_comodato: number;
  valor_original: number;
  valor_neto: number;
}

export interface ComodatoPorEstado {
  status: string;
  count: number;
  valor_original: number;
}

export interface ActivoHuerfano {
  no_cia: string;
  no_acti: string;
  descri: string;
  marca: string | null;
  modelo: string | null;
  val_original: number;
  val_neto: number;
  f_ingre: string | null;
  contrato_sysid: string | null;
  centro_costo: string | null;
  no_cliente: string | null;
}

export interface BaseInstaladaComodato {
  no_cia: string;
  pais: string;
  sys_id: string;
  nombre_cliente: string;
  instalacion: string;
  desc_marca: string | null;
  descmodelo: string | null;
  descequi: string | null;
  est_instal: string;
  tipo_contrato: string;
  no_activo: string | null;
  kam: string | null;
  fini_contr: string | null;
  ffin_contr: string | null;
}

export interface DepreciacionBand {
  band: string;
  count: number;
  valor_original: number;
  valor_neto: number;
  orphans: number;
}

export interface CohorteEdad {
  year: number;
  total: number;
  orphans: number;
  avg_depreciation_pct: number | null;
}

export interface TrazabilidadSegment {
  segment: string;
  count: number;
  valor_original: number;
  valor_neto: number;
}

export interface StatusDetallado {
  status: string;
  ubicacion: string;
  con_cliente: number;
  sin_cliente: number;
  total: number;
  valor_original: number;
  equipo_promed_s: number;
  equipo_promed_n: number;
}

// ─── Summary Stats ───────────────────────────────────────────────────────────

export async function getComodatoSummary(): Promise<ComodatoSummary> {
  // Run all simple queries in parallel for speed
  const [activoStats, matchStats, installedStats, baseCount] = await Promise.all([
    // 1. Total comodato activos + values (no join needed)
    queryRedshift<{
      total: string;
      valor_original: string;
      valor_neto: string;
    }>(`
      SELECT COUNT(*) as total,
        COALESCE(SUM(val_original), 0) as valor_original,
        COALESCE(SUM(val_original - depacum_valorig), 0) as valor_neto
      FROM naf6.arafma WHERE indcomodato = 'S'
    `),
    // 2. Matched vs unmatched (use EXISTS for efficiency)
    queryRedshift<{
      con_comodato: string;
      sin_comodato: string;
      total_contratos: string;
    }>(`
      SELECT
        (SELECT COUNT(*) FROM naf6.arafma a WHERE a.indcomodato = 'S'
          AND EXISTS (SELECT 1 FROM naf6.arafcom c WHERE c.no_cia = a.no_cia AND c.equipo_activo = a.no_acti)
        ) as con_comodato,
        (SELECT COUNT(*) FROM naf6.arafma a WHERE a.indcomodato = 'S'
          AND NOT EXISTS (SELECT 1 FROM naf6.arafcom c WHERE c.no_cia = a.no_cia AND c.equipo_activo = a.no_acti)
        ) as sin_comodato,
        (SELECT COUNT(DISTINCT no_comodato || no_cia) FROM naf6.arafcom) as total_contratos
    `),
    // 3. Installed status counts
    queryRedshift<{ instalados: string; no_instalados: string }>(`
      SELECT
        COUNT(CASE WHEN status = 'Instalado' THEN 1 END) as instalados,
        COUNT(CASE WHEN status != 'Instalado' OR status IS NULL THEN 1 END) as no_instalados
      FROM naf6.arafcom
    `),
    // 4. Base instalada comodatos count
    queryRedshift<{ cnt: string }>(`
      SELECT COUNT(*) as cnt FROM inventario.base_instalada_promed WHERE tipo_contrato = 'COMODATO'
    `),
  ]);

  return {
    totalActivos: parseInt(activoStats[0].total),
    totalComodatos: parseInt(matchStats[0].total_contratos),
    activosConComodato: parseInt(matchStats[0].con_comodato),
    activosSinComodato: parseInt(matchStats[0].sin_comodato),
    instalados: parseInt(installedStats[0].instalados),
    noInstalados: parseInt(installedStats[0].no_instalados),
    valorTotalOriginal: parseFloat(activoStats[0].valor_original),
    valorTotalDepreciado: parseFloat(activoStats[0].valor_neto),
    baseInstaladaComodatos: parseInt(baseCount[0].cnt),
  };
}

// ─── Activos con/sin Comodato (paginated) ────────────────────────────────────

export async function getActivosComodato(params: {
  cia?: string;
  soloHuerfanos?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{ rows: ActivoComodato[]; total: number }> {
  const { cia, soloHuerfanos = false, limit = 100, offset = 0 } = params;

  // Build WHERE for data query (needs JOIN)
  let dataWhere = "WHERE a.indcomodato = 'S'";
  const dataParams: unknown[] = [];
  let paramIdx = 1;
  if (cia) {
    dataWhere += ` AND a.no_cia = $${paramIdx++}`;
    dataParams.push(cia);
  }
  if (soloHuerfanos) {
    dataWhere += ` AND c.no_comodato IS NULL`;
  }

  // Count: use simple ARAFMA count (no join) unless filtering by huerfanos
  const countPromise = soloHuerfanos
    ? queryRedshift<{ cnt: string }>(
        `SELECT COUNT(*) as cnt FROM naf6.arafma a
         WHERE a.indcomodato = 'S'
         ${cia ? `AND a.no_cia = $1` : ''}
         AND NOT EXISTS (SELECT 1 FROM naf6.arafcom c WHERE c.no_cia = a.no_cia AND c.equipo_activo = a.no_acti)`,
        cia ? [cia] : []
      )
    : queryRedshift<{ cnt: string }>(
        `SELECT COUNT(*) as cnt FROM naf6.arafma WHERE indcomodato = 'S' ${cia ? `AND no_cia = $1` : ''}`,
        cia ? [cia] : []
      );

  const dataPromise = queryRedshift<ActivoComodato>(
    `SELECT
      a.no_cia, a.no_acti, a.descri, a.marca, a.modelo, a.serie,
      COALESCE(a.val_original, 0) as val_original,
      COALESCE(a.depacum_valorig, 0) as dep_acum,
      COALESCE(a.val_original, 0) - COALESCE(a.depacum_valorig, 0) as val_neto,
      a.indcomodato, a.contrato_sysid,
      c.no_comodato, c.cod_comodato, c.cliente,
      c.status as com_status, c.fecha_inic, c.fecha_fin,
      c.monto_mensual, c.instalado_en, c.tipo_contrato,
      a.f_ingre, a.centro_costo
    FROM naf6.arafma a
    LEFT JOIN naf6.arafcom c ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
    ${dataWhere}
    ORDER BY a.val_original DESC NULLS LAST
    LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
    [...dataParams, limit, offset]
  );

  const [countResult, rows] = await Promise.all([countPromise, dataPromise]);
  return { rows, total: parseInt(countResult[0].cnt) };
}

// ─── Breakdown by Company ────────────────────────────────────────────────────

export async function getComodatosPorCompania(): Promise<ComodatoPorCompania[]> {
  // Deduplicated LEFT JOIN avoids Redshift correlated-subquery limitation
  const rows = await queryRedshift<{
    no_cia: string;
    total: string;
    con_comodato: string;
    sin_comodato: string;
    valor_original: string;
    valor_neto: string;
  }>(`
    SELECT
      a.no_cia,
      COUNT(*) as total,
      SUM(CASE WHEN c.equipo_activo IS NOT NULL THEN 1 ELSE 0 END) as con_comodato,
      SUM(CASE WHEN c.equipo_activo IS NULL THEN 1 ELSE 0 END) as sin_comodato,
      COALESCE(SUM(a.val_original), 0) as valor_original,
      COALESCE(SUM(a.val_original - a.depacum_valorig), 0) as valor_neto
    FROM naf6.arafma a
    LEFT JOIN (SELECT DISTINCT no_cia, equipo_activo FROM naf6.arafcom) c
      ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
    WHERE a.indcomodato = 'S'
    GROUP BY a.no_cia
    ORDER BY COUNT(*) DESC
  `);

  return rows.map(r => ({
    no_cia: r.no_cia,
    total_activos: parseInt(r.total),
    con_comodato: parseInt(r.con_comodato),
    sin_comodato: parseInt(r.sin_comodato),
    valor_original: parseFloat(r.valor_original),
    valor_neto: parseFloat(r.valor_neto),
  }));
}

// ─── Comodato Status Distribution ────────────────────────────────────────────

export async function getComodatosPorEstado(): Promise<ComodatoPorEstado[]> {
  // Normalize status with UPPER(TRIM) to merge 'No instalado' / 'No Instalado' variants
  const [comStatus, orphanStats] = await Promise.all([
    queryRedshift<{ status: string; count: string; valor_original: string }>(`
      SELECT
        CASE UPPER(TRIM(c.status))
          WHEN 'INSTALADO' THEN 'Instalado'
          WHEN 'NO INSTALADO' THEN 'No instalado'
          ELSE COALESCE(TRIM(c.status), 'Desconocido')
        END as status,
        COUNT(*) as count,
        COALESCE(SUM(a.val_original), 0) as valor_original
      FROM naf6.arafcom c
      JOIN naf6.arafma a ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
      WHERE a.indcomodato = 'S' AND c.status IS NOT NULL AND TRIM(c.status) != ''
      GROUP BY 1
      ORDER BY count DESC
    `),
    queryRedshift<{ cnt: string; valor: string }>(`
      SELECT COUNT(*) as cnt, COALESCE(SUM(val_original), 0) as valor
      FROM naf6.arafma a
      WHERE a.indcomodato = 'S'
        AND NOT EXISTS (SELECT 1 FROM naf6.arafcom c WHERE c.no_cia = a.no_cia AND c.equipo_activo = a.no_acti)
    `),
  ]);

  const results: ComodatoPorEstado[] = comStatus.map(r => ({
    status: r.status,
    count: parseInt(r.count),
    valor_original: parseFloat(r.valor_original),
  }));

  if (parseInt(orphanStats[0].cnt) > 0) {
    results.push({
      status: 'Sin contrato',
      count: parseInt(orphanStats[0].cnt),
      valor_original: parseFloat(orphanStats[0].valor),
    });
  }

  return results.sort((a, b) => b.count - a.count);
}

// ─── Detailed Status Breakdown (location, client, equipo_promed) ─────────────

export async function getStatusDetallado(): Promise<StatusDetallado[]> {
  const [contractRows, orphanRow] = await Promise.all([
    queryRedshift<{
      status: string;
      ubicacion: string;
      con_cliente: string;
      sin_cliente: string;
      total: string;
      valor_original: string;
      equipo_promed_s: string;
      equipo_promed_n: string;
    }>(`
      SELECT
        CASE UPPER(TRIM(c.status))
          WHEN 'INSTALADO' THEN 'Instalado'
          WHEN 'NO INSTALADO' THEN 'No instalado'
          ELSE COALESCE(TRIM(c.status), 'Desconocido')
        END as status,
        CASE
          WHEN c.instalado_en IS NULL OR TRIM(c.instalado_en) = '' THEN 'Sin ubicación'
          WHEN UPPER(TRIM(c.instalado_en)) LIKE '%PROMED%' THEN 'En PROMED (bodega)'
          ELSE 'En cliente'
        END as ubicacion,
        SUM(CASE WHEN c.cliente IS NOT NULL AND TRIM(c.cliente) != '' THEN 1 ELSE 0 END) as con_cliente,
        SUM(CASE WHEN c.cliente IS NULL OR TRIM(c.cliente) = '' THEN 1 ELSE 0 END) as sin_cliente,
        COUNT(*) as total,
        COALESCE(SUM(a.val_original), 0) as valor_original,
        SUM(CASE WHEN c.equipo_promed = 'S' THEN 1 ELSE 0 END) as equipo_promed_s,
        SUM(CASE WHEN c.equipo_promed = 'N' THEN 1 ELSE 0 END) as equipo_promed_n
      FROM naf6.arafcom c
      JOIN naf6.arafma a ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
      WHERE a.indcomodato = 'S' AND c.status IS NOT NULL AND TRIM(c.status) != ''
      GROUP BY 1, 2
      ORDER BY COUNT(*) DESC
    `),
    queryRedshift<{ cnt: string; valor: string }>(`
      SELECT COUNT(*) as cnt, COALESCE(SUM(val_original), 0) as valor
      FROM naf6.arafma a
      WHERE a.indcomodato = 'S'
        AND NOT EXISTS (SELECT 1 FROM naf6.arafcom c WHERE c.no_cia = a.no_cia AND c.equipo_activo = a.no_acti)
    `),
  ]);

  const results: StatusDetallado[] = contractRows.map(r => ({
    status: r.status,
    ubicacion: r.ubicacion,
    con_cliente: parseInt(r.con_cliente),
    sin_cliente: parseInt(r.sin_cliente),
    total: parseInt(r.total),
    valor_original: parseFloat(r.valor_original),
    equipo_promed_s: parseInt(r.equipo_promed_s),
    equipo_promed_n: parseInt(r.equipo_promed_n),
  }));

  if (parseInt(orphanRow[0].cnt) > 0) {
    results.push({
      status: 'Sin contrato',
      ubicacion: 'Desconocida',
      con_cliente: 0,
      sin_cliente: parseInt(orphanRow[0].cnt),
      total: parseInt(orphanRow[0].cnt),
      valor_original: parseFloat(orphanRow[0].valor),
      equipo_promed_s: 0,
      equipo_promed_n: 0,
    });
  }

  return results;
}

// ─── Activos Huérfanos (comodato flag but no contract) ───────────────────────

export async function getActivosHuerfanos(params: {
  cia?: string;
  limit?: number;
  offset?: number;
}): Promise<{ rows: ActivoHuerfano[]; total: number }> {
  const { cia, limit = 50, offset = 0 } = params;

  let whereClause = "WHERE a.indcomodato = 'S' AND c.no_comodato IS NULL";
  const queryParams: unknown[] = [];
  let paramIdx = 1;

  if (cia) {
    whereClause += ` AND a.no_cia = $${paramIdx++}`;
    queryParams.push(cia);
  }

  const [countResult] = await queryRedshift<{ cnt: string }>(
    `SELECT COUNT(*) as cnt FROM naf6.arafma a
     LEFT JOIN naf6.arafcom c ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
     ${whereClause}`,
    queryParams
  );

  const rows = await queryRedshift<ActivoHuerfano>(
    `SELECT
      a.no_cia, a.no_acti, a.descri, a.marca, a.modelo,
      COALESCE(a.val_original, 0) as val_original,
      COALESCE(a.val_original, 0) - COALESCE(a.depacum_valorig, 0) as val_neto,
      a.f_ingre, a.contrato_sysid, a.centro_costo, a.no_cliente
    FROM naf6.arafma a
    LEFT JOIN naf6.arafcom c ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
    ${whereClause}
    ORDER BY a.val_original DESC NULLS LAST
    LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
    [...queryParams, limit, offset]
  );

  return { rows, total: parseInt(countResult.cnt) };
}

// ─── Base Instalada (COMODATO type only) ─────────────────────────────────────

export async function getBaseInstaladaComodatos(params: {
  cia?: string;
  limit?: number;
  offset?: number;
}): Promise<{ rows: BaseInstaladaComodato[]; total: number }> {
  const { cia, limit = 50, offset = 0 } = params;

  let whereClause = "WHERE tipo_contrato = 'COMODATO'";
  const queryParams: unknown[] = [];
  let paramIdx = 1;

  if (cia) {
    whereClause += ` AND no_cia = $${paramIdx++}`;
    queryParams.push(cia);
  }

  const [countResult] = await queryRedshift<{ cnt: string }>(
    `SELECT COUNT(*) as cnt FROM inventario.base_instalada_promed ${whereClause}`,
    queryParams
  );

  const rows = await queryRedshift<BaseInstaladaComodato>(
    `SELECT
      no_cia, pais, sys_id, nombre_cliente, instalacion,
      desc_marca, descmodelo, descequi, est_instal, tipo_contrato,
      no_activo, kam, fini_contr, ffin_contr
    FROM inventario.base_instalada_promed
    ${whereClause}
    ORDER BY nombre_cliente, sys_id
    LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
    [...queryParams, limit, offset]
  );

  return { rows, total: parseInt(countResult.cnt) };
}

// ─── Cross-reference: Base Instalada items NOT in ARAFMA ─────────────────────

export async function getBaseInstaladaSinActivo(params: {
  cia?: string;
  limit?: number;
  offset?: number;
}): Promise<{ rows: BaseInstaladaComodato[]; total: number }> {
  const { cia, limit = 50, offset = 0 } = params;

  let whereClause = "WHERE b.tipo_contrato = 'COMODATO' AND (b.no_activo IS NULL OR b.no_activo = '')";
  const queryParams: unknown[] = [];
  let paramIdx = 1;

  if (cia) {
    whereClause += ` AND b.no_cia = $${paramIdx++}`;
    queryParams.push(cia);
  }

  const [countResult] = await queryRedshift<{ cnt: string }>(
    `SELECT COUNT(*) as cnt FROM inventario.base_instalada_promed b ${whereClause}`,
    queryParams
  );

  const rows = await queryRedshift<BaseInstaladaComodato>(
    `SELECT
      b.no_cia, b.pais, b.sys_id, b.nombre_cliente, b.instalacion,
      b.desc_marca, b.descmodelo, b.descequi, b.est_instal, b.tipo_contrato,
      b.no_activo, b.kam, b.fini_contr, b.ffin_contr
    FROM inventario.base_instalada_promed b
    ${whereClause}
    ORDER BY b.nombre_cliente, b.sys_id
    LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
    [...queryParams, limit, offset]
  );

  return { rows, total: parseInt(countResult.cnt) };
}

// ─── Depreciation Depth Distribution ──────────────────────────────────────────

export async function getDepreciacionDistribucion(): Promise<DepreciacionBand[]> {
  const rows = await queryRedshift<{
    depreciation_band: string;
    count: string;
    valor_original_total: string;
    valor_neto_total: string;
    orphans_in_band: string;
  }>(`
    SELECT
      CASE
        WHEN a.val_original IS NULL OR a.val_original <= 0 THEN 'Sin valor registrado'
        WHEN (a.val_original - COALESCE(a.depacum_valorig, 0)) <= 0 THEN 'Totalmente depreciado (100%)'
        WHEN COALESCE(a.depacum_valorig, 0) / a.val_original > 0.9 THEN '90-99% depreciado'
        WHEN COALESCE(a.depacum_valorig, 0) / a.val_original > 0.5 THEN '50-90% depreciado'
        WHEN COALESCE(a.depacum_valorig, 0) / a.val_original > 0.0 THEN '1-50% depreciado'
        ELSE 'Sin depreciación (0%)'
      END as depreciation_band,
      COUNT(*) as count,
      COALESCE(SUM(a.val_original), 0) as valor_original_total,
      COALESCE(SUM(a.val_original - COALESCE(a.depacum_valorig, 0)), 0) as valor_neto_total,
      SUM(CASE WHEN c.equipo_activo IS NULL THEN 1 ELSE 0 END) as orphans_in_band
    FROM naf6.arafma a
    LEFT JOIN (SELECT DISTINCT no_cia, equipo_activo FROM naf6.arafcom) c
      ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
    WHERE a.indcomodato = 'S'
    GROUP BY 1
    ORDER BY COUNT(*) DESC
  `);

  return rows.map(r => ({
    band: r.depreciation_band,
    count: parseInt(r.count),
    valor_original: parseFloat(r.valor_original_total),
    valor_neto: parseFloat(r.valor_neto_total),
    orphans: parseInt(r.orphans_in_band),
  }));
}

// ─── Age Cohort × Orphan Status ───────────────────────────────────────────────

export async function getCohortesEdad(): Promise<CohorteEdad[]> {
  const rows = await queryRedshift<{
    year_ingreso: string;
    total: string;
    orphans: string;
    avg_depreciation_pct: string | null;
  }>(`
    SELECT
      EXTRACT(YEAR FROM a.f_ingre) as year_ingreso,
      COUNT(*) as total,
      SUM(CASE WHEN c.equipo_activo IS NULL THEN 1 ELSE 0 END) as orphans,
      AVG(CASE WHEN a.val_original > 0
        THEN COALESCE(a.depacum_valorig, 0) / a.val_original ELSE NULL END) as avg_depreciation_pct
    FROM naf6.arafma a
    LEFT JOIN (SELECT DISTINCT no_cia, equipo_activo FROM naf6.arafcom) c
      ON a.no_cia = c.no_cia AND a.no_acti = c.equipo_activo
    WHERE a.indcomodato = 'S' AND a.f_ingre IS NOT NULL
    GROUP BY 1
    ORDER BY 1
  `);

  return rows.map(r => ({
    year: parseInt(String(r.year_ingreso)),
    total: parseInt(r.total),
    orphans: parseInt(r.orphans),
    avg_depreciation_pct: r.avg_depreciation_pct ? parseFloat(r.avg_depreciation_pct) : null,
  }));
}

// ─── Three-Way Trazabilidad (ARAFMA × ARAFCOM × BASE_INSTALADA) ──────────────

export async function getTrazabilidad(): Promise<TrazabilidadSegment[]> {
  const rows = await queryRedshift<{
    tracking_status: string;
    count: string;
    valor_original: string;
    valor_neto: string;
  }>(`
    SELECT
      CASE
        WHEN c.equipo_activo IS NOT NULL AND b.no_activo IS NOT NULL THEN 'Rastreo Completo'
        WHEN c.equipo_activo IS NOT NULL AND b.no_activo IS NULL THEN 'Solo Contrato'
        WHEN c.equipo_activo IS NULL AND b.no_activo IS NOT NULL THEN 'Solo Base Instalada'
        ELSE 'Activo Fantasma'
      END as tracking_status,
      COUNT(*) as count,
      COALESCE(SUM(a.val_original), 0) as valor_original,
      COALESCE(SUM(a.val_original - COALESCE(a.depacum_valorig, 0)), 0) as valor_neto
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
    ORDER BY COUNT(*) DESC
  `);

  return rows.map(r => ({
    segment: r.tracking_status,
    count: parseInt(r.count),
    valor_original: parseFloat(r.valor_original),
    valor_neto: parseFloat(r.valor_neto),
  }));
}
