import type { Request, Response } from 'express';

import { AdminQuadrasUseCase } from './adminQuadras.usecase.js';

export class AdminQuadrasController {
  constructor(private readonly useCase: AdminQuadrasUseCase) {}

  list = async (_req: Request, res: Response) => {
    const quadras = await this.useCase.list();
    res.status(200).json({ quadras });
  };
}

