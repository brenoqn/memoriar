import pg from 'pg';

import { runDemoSeed, runMigrations } from '../src/db/migrations';
import { hashPassword } from '../src/modules/auth/password';
import { assertDisposableDatabase, TEST_DATABASE_URL, TEST_USERS } from './testDatabase';

export default async function setup() {
  assertDisposableDatabase(TEST_DATABASE_URL);
  const pool = new pg.Pool({ connectionString: TEST_DATABASE_URL, max: 2 });
  try {
    await pool.query('drop schema if exists public cascade');
    await pool.query('create schema public');
    await runMigrations(pool);
    await runDemoSeed(pool);

    for (const user of Object.values(TEST_USERS)) {
      await pool.query(
        `insert into app_users (email, password_hash, role_id, is_active)
         select $1, $2, r.id, $3 from app_roles r where r.key = $4`,
        [user.email, await hashPassword(user.password), user.email !== TEST_USERS.inactive.email, user.role]
      );
    }
  } finally {
    await pool.end();
  }
}
