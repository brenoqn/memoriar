import { Router } from 'express';

import { asyncHandler } from '../../core/http/asyncHandler.js';
import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { getAdminOverviewController } from './adminOverviewController.factory.js';

export function adminOverviewRoutes() {
  const router = Router();
  const controller = getAdminOverviewController();

  router.get('/', requireAdminAuth, asyncHandler(controller.get));

  return router;
}

