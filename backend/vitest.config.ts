import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: ['./test/globalSetup.ts'],
    setupFiles: ['./test/vitest.setup.ts'],
    // Os testes compartilham um único banco de teste.
    fileParallelism: false,
    testTimeout: 15_000,
    hookTimeout: 30_000
  }
});
