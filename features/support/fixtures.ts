import fs from 'fs';
import path from 'path';

const FIXTURES_ROOT = path.resolve(__dirname, '..', '..', 'fixtures');

export function resolveFixturePath(relativePath: string): string {
  const normalized = `${relativePath ?? ''}`.trim().replace(/\\/g, '/');
  if (!normalized) {
    throw new Error('Fixture path must not be empty.');
  }

  const candidate = path.resolve(FIXTURES_ROOT, normalized);
  const rootWithSep = `${FIXTURES_ROOT}${path.sep}`;
  if (candidate !== FIXTURES_ROOT && !candidate.startsWith(rootWithSep)) {
    throw new Error(`Fixture path escapes fixtures directory: ${relativePath}`);
  }
  if (!fs.existsSync(candidate)) {
    throw new Error(`Fixture file not found: ${relativePath} (${candidate})`);
  }
  if (!fs.statSync(candidate).isFile()) {
    throw new Error(`Fixture path is not a file: ${relativePath}`);
  }
  return candidate;
}

export function listFixtureHint(relativePath: string): string {
  return path.join('fixtures', relativePath).replace(/\\/g, '/');
}

