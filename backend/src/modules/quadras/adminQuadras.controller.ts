import type { Request, Response } from 'express';

import type { AuthedRequest } from '../../middlewares/adminAuth.middleware.js';
import { AdminQuadrasUseCase } from './adminQuadras.usecase.js';

export class AdminQuadrasController {
  constructor(private readonly useCase: AdminQuadrasUseCase) {}

  list = async (req: Request, res: Response) => {
    const accessToken = (req as AuthedRequest).accessToken;
    const quadras = await this.useCase.list({ accessToken });
    res.status(200).json({ quadras });
  };
}

