import cors from 'cors';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

import { env } from '../config/env.js';
import { getPool } from '../../db/pool.js';
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

  // Saudável só quando a API consegue consultar o banco: um /health 200 confirma a conectividade.
  app.get('/health', async (_req, res) => {
    try {
      await getPool().query('select 1');
      res.status(200).json({ ok: true, database: 'ok' });
    } catch {
      res.status(503).json({ ok: false, database: 'unavailable' });
    }
  });

  app.use('/api', routes());

  app.use((_req, res) => {
    res.status(404).json({ error: 'not_found' });
  });

  // Erros inesperados (incluindo falhas do banco) viram 500 explícito, nunca uma lista vazia.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    if ((err as { type?: string })?.type === 'entity.parse.failed') {
      res.status(400).json({ error: 'invalid_json' });
      return;
    }
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`[api] ${req.method} ${req.path} falhou: ${message}\n`);
    res.status(500).json({ error: 'internal_error', message: 'Não foi possível concluir a solicitação.' });
  });

  return app;
}
