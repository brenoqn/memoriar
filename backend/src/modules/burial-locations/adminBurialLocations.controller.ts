import type { Request, Response } from 'express';

import { AdminBurialLocationsUseCase } from './adminBurialLocations.usecase.js';

export class AdminBurialLocationsController {
  constructor(private readonly useCase: AdminBurialLocationsUseCase) {}

  list = async (_req: Request, res: Response) => {
    const locations = await this.useCase.list();
    res.status(200).json({ locations });
  };
}

