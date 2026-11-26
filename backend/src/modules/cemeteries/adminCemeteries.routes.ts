import { Router } from 'express';

import { asyncHandler } from '../../core/http/asyncHandler.js';
import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { getAdminCemeteriesController } from './adminCemeteriesController.factory.js';

export function adminCemeteriesRoutes() {
  const router = Router();
  const controller = getAdminCemeteriesController();

  router.get('/', requireAdminAuth, asyncHandler(controller.list));

  return router;
}
