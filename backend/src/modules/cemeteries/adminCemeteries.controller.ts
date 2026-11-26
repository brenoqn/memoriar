import type { Request, Response } from 'express';
import type { Cemetery } from '@memoriar/shared';

import { AdminCemeteriesUseCase } from './adminCemeteries.usecase.js';

export class AdminCemeteriesController {
  constructor(private readonly useCase: AdminCemeteriesUseCase) {}

  list = async (_req: Request, res: Response) => {
    const cemeteries: Cemetery[] = await this.useCase.list();
    res.status(200).json({ cemeteries });
  };
}
