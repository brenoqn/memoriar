import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { describe, expect, it } from 'vitest';

import { TEST_DATABASE_URL } from './testDatabase';

const run = promisify(execFile);
const backendDir = fileURLToPath(new URL('..', import.meta.url));

describe('CLI do banco', () => {
  it('roda migrate só com DATABASE_URL, sem JWT_SECRET', async () => {
    const env = { PATH: process.env.PATH ?? '', DATABASE_URL: TEST_DATABASE_URL };
    const { stdout } = await run(process.execPath, ['--import', 'tsx', 'src/db/cli.ts', 'migrate'], {
      cwd: backendDir,
      env
    });
    expect(stdout).toContain('Nenhuma migration pendente.');
  });
});
