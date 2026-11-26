import type { Request, Response } from 'express';
import { z } from 'zod';

import { AdminAuthUseCase } from './adminAuth.usecase.js';

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128)
});

export class AdminAuthController {
  constructor(private readonly useCase: AdminAuthUseCase) {}

  login = async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ kind: 'invalid_body', error: 'invalid_body' });
      return;
    }

    const result = await this.useCase.login(parsed.data);
    if (result.kind === 'invalid_credentials') {
      res.status(401).json({ kind: 'invalid_credentials', error: 'invalid_credentials' });
      return;
    }

    res.status(200).json(result);
  };
}
