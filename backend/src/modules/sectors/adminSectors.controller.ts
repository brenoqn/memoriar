import type { Request, Response } from 'express';

import { AdminSectorsUseCase } from './adminSectors.usecase.js';

export class AdminSectorsController {
  constructor(private readonly useCase: AdminSectorsUseCase) {}

  list = async (_req: Request, res: Response) => {
    const sectors = await this.useCase.list();
    res.status(200).json({ sectors });
  };
}

