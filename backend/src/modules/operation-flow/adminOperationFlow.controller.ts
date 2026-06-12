import type { Request, Response } from 'express';
import { z } from 'zod';

import type { AdminOperationFlowPayload } from '@memoriar/shared';

import { AdminOperationFlowUseCase } from './adminOperationFlow.usecase.js';

const uuid = z.string().uuid();

const payloadSchema: z.ZodType<AdminOperationFlowPayload> = z.object({
  location: z.object({
    mode: z.enum(['existing', 'new', 'not_confirmed']),
    existing_location_id: uuid.nullable(),
    new_location: z
      .object({
        cemetery_id: uuid,
        sector_id: uuid,
        quadra_id: uuid.nullable(),
        type_code: z.string().trim().min(1).max(16),
        code: z.string().trim().min(1).max(64),
        location_text: z.string().trim().max(400).nullable(),
        map_node_id: uuid.nullable()
      })
      .nullable()
  }),
  burial_case: z.object({
    deceased_name: z.string().trim().min(1).max(200),
    public_reference: z.string().trim().max(64).nullable(),
    status: z.enum(['draft', 'in_review', 'not_found_precisely']),
    approx_location_text: z.string().trim().max(400).nullable(),
    notes: z.string().trim().max(400).nullable()
  }),
  movements: z
    .array(
      z.object({
        movement_type: z.enum(['burial', 'transfer', 'exhumation', 'relocation', 'ossuary_transfer']),
        occurred_on: z.string().trim().min(1).max(20),
        from_location_code: z.string().trim().max(64).nullable(),
        to_location_code: z.string().trim().max(64).nullable(),
        is_confirmed: z.boolean(),
        notes: z.string().trim().max(400).nullable()
      })
    )
    .min(1)
});

export class AdminOperationFlowController {
  constructor(private readonly useCase: AdminOperationFlowUseCase) {}

  preview = async (req: Request, res: Response) => {
    const parsed = payloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'invalid_payload',
        message: 'Dados incompletos para gerar a prévia.',
        details: parsed.error.flatten()
      });
      return;
    }

    const result = this.useCase.preview(parsed.data);
    if (result.kind === 'invalid') {
      res.status(422).json({
        error: 'validation_failed',
        message: 'Corrija os campos destacados para continuar.',
        errors: result.errors
      });
      return;
    }

    res.status(200).json({ preview: result.preview });
  };
}
