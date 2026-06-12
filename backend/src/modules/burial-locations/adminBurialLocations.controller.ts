import type { Request, Response } from 'express';

import type { AuthedRequest } from '../../middlewares/adminAuth.middleware.js';
import { AdminBurialLocationsUseCase } from './adminBurialLocations.usecase.js';

export class AdminBurialLocationsController {
  constructor(private readonly useCase: AdminBurialLocationsUseCase) {}

  list = async (req: Request, res: Response) => {
    const accessToken = (req as AuthedRequest).accessToken;
    const locations = await this.useCase.list({ accessToken });
    res.status(200).json({ locations });
  };
}

