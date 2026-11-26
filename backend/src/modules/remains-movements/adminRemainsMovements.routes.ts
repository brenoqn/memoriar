import { Router } from 'express';

import { asyncHandler } from '../../core/http/asyncHandler.js';
import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { getAdminRemainsMovementsController } from './adminRemainsMovementsController.factory.js';

export function adminRemainsMovementsRoutes() {
  const router = Router();
  const controller = getAdminRemainsMovementsController();

  router.get('/', requireAdminAuth, asyncHandler(controller.list));

  return router;
}

