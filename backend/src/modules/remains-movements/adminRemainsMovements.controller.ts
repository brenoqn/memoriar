import type { Request, Response } from 'express';

import { AdminRemainsMovementsUseCase } from './adminRemainsMovements.usecase.js';

export class AdminRemainsMovementsController {
  constructor(private readonly useCase: AdminRemainsMovementsUseCase) {}

  list = async (_req: Request, res: Response) => {
    const movements = await this.useCase.list();
    res.status(200).json({ movements });
  };
}

