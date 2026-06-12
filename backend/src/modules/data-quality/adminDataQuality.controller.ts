import type { Request, Response } from 'express';

import type { AuthedRequest } from '../../middlewares/adminAuth.middleware.js';
import { AdminDataQualityUseCase } from './adminDataQuality.usecase.js';

export class AdminDataQualityController {
  constructor(private readonly useCase: AdminDataQualityUseCase) {}

  get = async (req: Request, res: Response) => {
    const accessToken = (req as AuthedRequest).accessToken;
    const dataQuality = await this.useCase.get({ accessToken });
    res.status(200).json(dataQuality);
  };
}

