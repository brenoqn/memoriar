import type { Request, Response } from 'express';

import type { AuthedRequest } from '../../middlewares/adminAuth.middleware.js';
import { AdminRemainsMovementsUseCase } from './adminRemainsMovements.usecase.js';

export class AdminRemainsMovementsController {
  constructor(private readonly useCase: AdminRemainsMovementsUseCase) {}

  list = async (req: Request, res: Response) => {
    const accessToken = (req as AuthedRequest).accessToken;
    const movements = await this.useCase.list({ accessToken });
    res.status(200).json({ movements });
  };
}

