import { Router } from 'express';

import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { AdminOperationFlowController } from './adminOperationFlow.controller.js';
import { AdminOperationFlowUseCase } from './adminOperationFlow.usecase.js';

export function adminOperationFlowRoutes() {
  const router = Router();
  const controller = new AdminOperationFlowController(new AdminOperationFlowUseCase());

  router.post('/preview', requireAdminAuth, controller.preview);

  return router;
}

