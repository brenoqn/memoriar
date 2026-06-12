import { env } from '../config/env.js';
import { createApp } from './app.js';

export function createServer() {
  const app = createApp();
  app.listen(env.PORT, () => {
    process.stdout.write(`memoriar-backend listening on :${env.PORT}\n`);
  });
}
