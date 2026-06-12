import type { Request, Response } from 'express';
import { z } from 'zod';

import { AdminAuthUseCase } from './adminAuth.usecase.js';

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128)
});

export class AdminAuthController {
  constructor(private readonly useCase: AdminAuthUseCase) {}

  login = async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'invalid_body' });
      return;
    }

    const result = await this.useCase.login(parsed.data);
    if (result.kind === 'invalid_credentials') {
      res.status(401).json({ error: 'invalid_credentials' });
      return;
    }
    if (result.kind === 'supabase_not_configured') {
      res.status(503).json({ error: 'supabase_not_configured' });
      return;
    }

    res.status(200).json(result);
  };
}
