import type { Request, Response } from 'express';

import type { AuthedRequest } from '../../middlewares/adminAuth.middleware.js';
import { AdminBurialCasesUseCase } from './adminBurialCases.usecase.js';

export class AdminBurialCasesController {
  constructor(private readonly useCase: AdminBurialCasesUseCase) {}

  list = async (req: Request, res: Response) => {
    const accessToken = (req as AuthedRequest).accessToken;
    const cases = await this.useCase.list({ accessToken });
    res.status(200).json({ cases });
  };
}

