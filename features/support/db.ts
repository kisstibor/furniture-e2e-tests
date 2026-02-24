import { resolveConfig } from './config';

export interface SqlQueryResult {
  rows: Record<string, unknown>[];
  rowCount: number;
}

export interface SqlDbClient {
  query(sql: string): Promise<SqlQueryResult>;
  close(): Promise<void>;
}

class NoopDbClient implements SqlDbClient {
  async query(): Promise<SqlQueryResult> {
    throw new Error('SQL DB is not configured. Set E2E_DB_DIALECT and connection env vars.');
  }
  async close(): Promise<void> {
    return;
  }
}

class PostgresDbClient implements SqlDbClient {
  constructor(private readonly client: any) {}
  async query(sql: string): Promise<SqlQueryResult> {
    const result = await this.client.query(sql);
    return { rows: (result?.rows ?? []) as Record<string, unknown>[], rowCount: Number(result?.rowCount ?? 0) };
  }
  async close(): Promise<void> {
    await this.client.end();
  }
}

class MySqlDbClient implements SqlDbClient {
  constructor(private readonly conn: any) {}
  async query(sql: string): Promise<SqlQueryResult> {
    const [rows] = await this.conn.query(sql);
    const array = Array.isArray(rows) ? rows : [];
    return { rows: array as Record<string, unknown>[], rowCount: array.length };
  }
  async close(): Promise<void> {
    await this.conn.end();
  }
}

class MsSqlDbClient implements SqlDbClient {
  constructor(private readonly pool: any) {}
  async query(sql: string): Promise<SqlQueryResult> {
    const result = await this.pool.request().query(sql);
    const rows = Array.isArray(result?.recordset) ? result.recordset : [];
    return { rows: rows as Record<string, unknown>[], rowCount: rows.length };
  }
  async close(): Promise<void> {
    await this.pool.close();
  }
}

let sharedDbClientPromise: Promise<SqlDbClient> | null = null;

export async function getSqlDbClient(): Promise<SqlDbClient> {
  if (!sharedDbClientPromise) {
    sharedDbClientPromise = createSqlDbClient();
  }
  return sharedDbClientPromise;
}

export async function disposeSqlDbClient(): Promise<void> {
  if (!sharedDbClientPromise) return;
  const client = await sharedDbClientPromise;
  sharedDbClientPromise = null;
  await client.close();
}

async function createSqlDbClient(): Promise<SqlDbClient> {
  const cfg = resolveConfig().db;
  const dialect = cfg.dialect ?? 'none';
  if (dialect === 'none') return new NoopDbClient();

  if (dialect === 'postgres') {
    const pg = await import('pg');
    const client = new (pg as any).Client({
      host: cfg.host,
      port: cfg.port,
      database: cfg.database,
      user: cfg.user,
      password: cfg.password,
    });
    await client.connect();
    return new PostgresDbClient(client);
  }

  if (dialect === 'mysql') {
    const mysql = await import('mysql2/promise');
    const conn = await (mysql as any).createConnection({
      host: cfg.host,
      port: cfg.port,
      database: cfg.database,
      user: cfg.user,
      password: cfg.password,
    });
    return new MySqlDbClient(conn);
  }

  if (dialect === 'mssql') {
    const mssql = await import('mssql');
    const pool = await (mssql as any).connect({
      server: cfg.host,
      port: cfg.port,
      database: cfg.database,
      user: cfg.user,
      password: cfg.password,
      options: {
        encrypt: cfg.encrypt,
        trustServerCertificate: true,
      },
    });
    return new MsSqlDbClient(pool);
  }

  throw new Error(`Unsupported E2E_DB_DIALECT: ${dialect}`);
}
