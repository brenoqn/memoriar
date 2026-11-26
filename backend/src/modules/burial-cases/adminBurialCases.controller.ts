import type { Request, Response } from 'express';

import { AdminBurialCasesUseCase } from './adminBurialCases.usecase.js';

export class AdminBurialCasesController {
  constructor(private readonly useCase: AdminBurialCasesUseCase) {}

  list = async (_req: Request, res: Response) => {
    const cases = await this.useCase.list();
    res.status(200).json({ cases });
  };
}

