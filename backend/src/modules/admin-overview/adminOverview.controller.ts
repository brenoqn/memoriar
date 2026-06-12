import type { Request, Response } from 'express';

import type { AuthedRequest } from '../../middlewares/adminAuth.middleware.js';
import { AdminOverviewUseCase } from './adminOverview.usecase.js';

export class AdminOverviewController {
  constructor(private readonly useCase: AdminOverviewUseCase) {}

  get = async (req: Request, res: Response) => {
    const accessToken = (req as AuthedRequest).accessToken;
    const overview = await this.useCase.getOverview({ accessToken });
    res.status(200).json({ overview });
  };
}

