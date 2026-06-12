import type { Request, Response } from 'express';
import type { Cemetery } from '@memoriar/shared';

import type { AuthedRequest } from '../../middlewares/adminAuth.middleware.js';
import { AdminCemeteriesUseCase } from './adminCemeteries.usecase.js';

export class AdminCemeteriesController {
  constructor(private readonly useCase: AdminCemeteriesUseCase) {}

  list = async (req: Request, res: Response) => {
    const authed = req as AuthedRequest;
    const cemeteries: Cemetery[] = await this.useCase.list({ accessToken: authed.accessToken });
    res.status(200).json({ cemeteries });
  };
}
