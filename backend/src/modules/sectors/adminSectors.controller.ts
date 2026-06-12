import type { Request, Response } from 'express';

import type { AuthedRequest } from '../../middlewares/adminAuth.middleware.js';
import { AdminSectorsUseCase } from './adminSectors.usecase.js';

export class AdminSectorsController {
  constructor(private readonly useCase: AdminSectorsUseCase) {}

  list = async (req: Request, res: Response) => {
    const accessToken = (req as AuthedRequest).accessToken;
    const sectors = await this.useCase.list({ accessToken });
    res.status(200).json({ sectors });
  };
}

