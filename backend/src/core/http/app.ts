import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from '../config/env.js';
import { routes } from '../../routes/index.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN,
      credentials: true
    })
  );
  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use('/api', routes());

  app.use((_req, res) => {
    res.status(404).json({ error: 'not_found' });
  });

  return app;
}
