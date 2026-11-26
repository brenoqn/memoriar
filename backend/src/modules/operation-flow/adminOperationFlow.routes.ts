import { Router } from 'express';

import { asyncHandler } from '../../core/http/asyncHandler.js';
import { getPool } from '../../db/pool.js';
import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { AdminOperationFlowController } from './adminOperationFlow.controller.js';
import { AdminOperationFlowUseCase } from './adminOperationFlow.usecase.js';
import { PgAdminOperationFlowRepository } from './repositories/pgAdminOperationFlow.repository.js';

export function adminOperationFlowRoutes() {
  const router = Router();
  const controller = new AdminOperationFlowController(
    new AdminOperationFlowUseCase(new PgAdminOperationFlowRepository(getPool()))
  );

  router.post('/preview', requireAdminAuth, asyncHandler(controller.preview));

  return router;
}

