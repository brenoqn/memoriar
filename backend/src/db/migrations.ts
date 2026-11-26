import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import type pg from 'pg';

// src/db e dist/db ficam a dois níveis de backend/, onde está a pasta db/ com os arquivos SQL.
const DB_DIR = fileURLToPath(new URL('../../db/', import.meta.url));
export const MIGRATIONS_DIR = `${DB_DIR}migrations/`;
export const DEMO_SEED_FILE = `${DB_DIR}seeds/demo_seed.sql`;

// Chave arbitrária e fixa para impedir duas execuções simultâneas do runner.
const MIGRATION_LOCK_KEY = 74_201_105;

export type MigrationResult = { applied: string[]; skipped: string[] };

async function listMigrationFiles() {
  const files = await readdir(MIGRATIONS_DIR);
  return files.filter((f) => /^\d{4}_[a-z0-9_]+\.sql$/.test(f)).sort();
}

export async function runMigrations(pool: pg.Pool): Promise<MigrationResult> {
  const client = await pool.connect();
  const result: MigrationResult = { applied: [], skipped: [] };
  try {
    await client.query('select pg_advisory_lock($1)', [MIGRATION_LOCK_KEY]);
    await client.query(`
      create table if not exists schema_migrations (
        version text primary key,
        applied_at timestamptz not null default now()
      )
    `);
    const { rows } = await client.query<{ version: string }>('select version from schema_migrations');
    const done = new Set(rows.map((r) => r.version));

    for (const file of await listMigrationFiles()) {
      const version = file.replace(/\.sql$/, '');
      if (done.has(version)) {
        result.skipped.push(version);
        continue;
      }
      const sql = await readFile(`${MIGRATIONS_DIR}${file}`, 'utf8');
      try {
        await client.query('begin');
        await client.query(sql);
        await client.query('insert into schema_migrations(version) values ($1)', [version]);
        await client.query('commit');
        result.applied.push(version);
      } catch (err) {
        await client.query('rollback').catch(() => undefined);
        throw new Error(`Falha ao aplicar a migration ${version}: ${(err as Error).message}`);
      }
    }
    return result;
  } finally {
    await client.query('select pg_advisory_unlock($1)', [MIGRATION_LOCK_KEY]).catch(() => undefined);
    client.release();
  }
}

export async function runDemoSeed(pool: pg.Pool) {
  const sql = await readFile(DEMO_SEED_FILE, 'utf8');
  const client = await pool.connect();
  try {
    await client.query('begin');
    await client.query(sql);
    await client.query('commit');
  } catch (err) {
    await client.query('rollback').catch(() => undefined);
    throw err;
  } finally {
    client.release();
  }
}
