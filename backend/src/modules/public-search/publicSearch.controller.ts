import type { Request, Response } from 'express';
import { z } from 'zod';

import { PublicSearchUseCase } from './publicSearch.usecase.js';

const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(120),
  cemeteryId: z.string().uuid().optional()
});

const idParamSchema = z.object({
  id: z.string().uuid()
});

export class PublicSearchController {
  constructor(private readonly useCase: PublicSearchUseCase) {}

  search = async (req: Request, res: Response) => {
    const parsed = searchQuerySchema.safeParse({
      q: req.query['q'],
      cemeteryId: req.query['cemeteryId']
    });
    if (!parsed.success) {
      res.status(400).json({ error: 'invalid_query', details: parsed.error.flatten() });
      return;
    }

    const items = await this.useCase.search(parsed.data);
    res.status(200).json({ items });
  };

  detail = async (req: Request, res: Response) => {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: 'invalid_id' });
      return;
    }

    const item = await this.useCase.detail({ burialCaseId: parsed.data.id });
    if (!item) {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    res.status(200).json({ item });
  };
}
