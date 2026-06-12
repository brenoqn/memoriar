import type { Request, Response } from 'express';
import { z } from 'zod';

import { MapUseCase } from './map.usecase.js';

const cemeteryParamSchema = z.object({
  cemeteryId: z.string().uuid()
});

export class MapController {
  constructor(private readonly useCase: MapUseCase) {}

  getMapNodes = async (req: Request, res: Response) => {
    const parsed = cemeteryParamSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: 'invalid_cemetery_id' });
      return;
    }

    const nodes = await this.useCase.getMapNodes({ cemeteryId: parsed.data.cemeteryId });
    res.status(200).json({ nodes });
  };
}
