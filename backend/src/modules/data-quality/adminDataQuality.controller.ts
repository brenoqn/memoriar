import type { Request, Response } from 'express';

import { AdminDataQualityUseCase } from './adminDataQuality.usecase.js';

export class AdminDataQualityController {
  constructor(private readonly useCase: AdminDataQualityUseCase) {}

  get = async (_req: Request, res: Response) => {
    const dataQuality = await this.useCase.get();
    res.status(200).json(dataQuality);
  };
}

