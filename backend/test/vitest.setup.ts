import { afterAll } from 'vitest';

import { TEST_DATABASE_URL, TEST_JWT_SECRET } from './testDatabase';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = TEST_DATABASE_URL;
process.env.JWT_SECRET = TEST_JWT_SECRET;

afterAll(async () => {
  const { closePool } = await import('../src/db/pool');
  await closePool();
});
