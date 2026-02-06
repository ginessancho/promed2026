import pg from "pg";

let _pool: pg.Pool | null = null;

export function getRedshiftPool(): pg.Pool {
  if (!_pool) {
    // Parse JDBC URL: jdbc:redshift://host:port/database
    const jdbcUrl = process.env.PROMED_AWS_URL || "";
    const match = jdbcUrl.match(/\/\/([^:]+):(\d+)\/(.+)/);
    
    const host = match ? match[1] : "localhost";
    const port = match ? parseInt(match[2]) : 5439;
    const database = match ? match[3] : process.env.PROMED_AWS_DATABASE || "rtdev";

    _pool = new pg.Pool({
      host,
      port,
      database,
      user: process.env.PROMED_AWS_USUARIO,
      password: process.env.PROMED_AWS_PASSWORD,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    _pool.on("error", (err) => {
      console.error("[Redshift] Pool error:", err.message);
    });

    console.log(`[Redshift] Pool created → ${host}:${port}/${database}`);
  }
  return _pool;
}

export async function queryRedshift<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const pool = getRedshiftPool();
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}
