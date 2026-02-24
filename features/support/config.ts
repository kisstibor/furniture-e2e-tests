import fs from 'fs';
import path from 'path';

export type SqlDialect = 'none' | 'postgres' | 'mysql' | 'mssql';

export interface ServiceProcessConfig {
  enabled: boolean;
  cmd: string;
  cwd: string;
  waitOnUrl: string;
}

export interface E2EConfig {
  baseUrl: string;
  backendApiBaseUrl: string;
  headless: boolean;
  timeoutMs: number;
  frontend: ServiceProcessConfig;
  backend: ServiceProcessConfig;
  db: {
    dialect: SqlDialect;
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    encrypt: boolean;
  };
  artifactsDir: string;
}

const envLoaded = { done: false };

function loadDotEnvIfPresent(projectRoot: string): void {
  if (envLoaded.done) return;
  envLoaded.done = true;

  const envFile = path.join(projectRoot, '.env');
  if (!fs.existsSync(envFile)) return;

  const lines = fs.readFileSync(envFile, 'utf8').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && process.env[key] == null) {
      process.env[key] = value;
    }
  }
}

function asBool(value: string | undefined, fallback: boolean): boolean {
  if (value == null) return fallback;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;
  return fallback;
}

function asInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(`${value ?? ''}`, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function resolveConfig(): E2EConfig {
  const projectRoot = path.resolve(__dirname, '..', '..');
  loadDotEnvIfPresent(projectRoot);

  const baseUrl = (process.env.E2E_BASE_URL ?? 'http://localhost:4200').replace(/\/+$/, '');
  const backendApiBaseUrl = (process.env.E2E_BACKEND_API_BASE_URL ?? 'http://localhost:3000/api').replace(/\/+$/, '');

  return {
    baseUrl,
    backendApiBaseUrl,
    headless: asBool(process.env.E2E_HEADLESS, true),
    timeoutMs: asInt(process.env.E2E_TIMEOUT_MS, 30000),
    frontend: {
      enabled: asBool(process.env.E2E_START_FRONTEND, false),
      cmd: process.env.E2E_FRONTEND_CMD ?? 'npm run start',
      cwd: path.resolve(projectRoot, process.env.E2E_FRONTEND_CWD ?? '..'),
      waitOnUrl: process.env.E2E_FRONTEND_WAIT_ON ?? `${baseUrl}/`,
    },
    backend: {
      enabled: asBool(process.env.E2E_START_BACKEND, false),
      cmd: process.env.E2E_BACKEND_CMD ?? 'npm run start:server',
      cwd: path.resolve(projectRoot, process.env.E2E_BACKEND_CWD ?? '..'),
      waitOnUrl: process.env.E2E_BACKEND_WAIT_ON ?? `${backendApiBaseUrl}/health`,
    },
    db: {
      dialect: (process.env.E2E_DB_DIALECT as SqlDialect) ?? 'none',
      host: process.env.E2E_DB_HOST ?? 'localhost',
      port: asInt(process.env.E2E_DB_PORT, 5432),
      database: process.env.E2E_DB_NAME ?? '',
      user: process.env.E2E_DB_USER ?? '',
      password: process.env.E2E_DB_PASSWORD ?? '',
      encrypt: asBool(process.env.E2E_DB_ENCRYPT, false),
    },
    artifactsDir: path.resolve(projectRoot, 'artifacts'),
  };
}
