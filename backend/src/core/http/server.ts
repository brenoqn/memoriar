import { env } from '../config/env.js';
import { createApp } from './app.js';

export function createServer() {
  const app = createApp();
  app.listen(env.PORT, '0.0.0.0', () => {
    process.stdout.write(`memoriar-backend listening on 0.0.0.0:${env.PORT}\n`);
  });
}
