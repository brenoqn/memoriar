import pg from 'pg';

import { readDatabaseEnv } from '../core/config/databaseEnv.js';

// Datas (date) chegam como texto 'YYYY-MM-DD', no mesmo formato que o contrato público já usa,
// em vez de virar Date com fuso horário aplicado.
pg.types.setTypeParser(pg.types.builtins.DATE, (value: string) => value);
// count(*) e bigint chegam como número (os volumes do Memoriar cabem com folga em Number).
pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => Number(value));
// timestamptz como string ISO 8601, como os contratos de @memoriar/shared declaram.
pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, (value: string) => new Date(value).toISOString());

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const config = readDatabaseEnv();
    pool = new pg.Pool({
      connectionString: config.DATABASE_URL,
      max: config.DATABASE_POOL_MAX,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 30_000,
      application_name: 'memoriar-api'
    });
    pool.on('error', (err) => {
      process.stderr.write(`[db] erro em conexão ociosa: ${err.message}\n`);
    });
  }
  return pool;
}

export async function closePool() {
  if (pool) {
    const current = pool;
    pool = null;
    await current.end();
  }
}

export type Queryable = Pick<pg.Pool, 'query'> | pg.PoolClient;

/** Executa `fn` numa transação. Se `actorUserId` for informado, fica disponível para a auditoria. */
export async function withTransaction<T>(
  fn: (client: pg.PoolClient) => Promise<T>,
  options: { actorUserId?: string } = {}
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('begin');
    if (options.actorUserId) {
      await client.query("select set_config('app.current_user_id', $1, true)", [options.actorUserId]);
    }
    const result = await fn(client);
    await client.query('commit');
    return result;
  } catch (err) {
    await client.query('rollback').catch(() => undefined);
    throw err;
  } finally {
    client.release();
  }
}
