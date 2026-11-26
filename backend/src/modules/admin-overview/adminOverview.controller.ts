import type { Request, Response } from 'express';

import { AdminOverviewUseCase } from './adminOverview.usecase.js';

export class AdminOverviewController {
  constructor(private readonly useCase: AdminOverviewUseCase) {}

  get = async (_req: Request, res: Response) => {
    const overview = await this.useCase.getOverview();
    res.status(200).json({ overview });
  };
}

