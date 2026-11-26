import { Router } from 'express';

import { asyncHandler } from '../../core/http/asyncHandler.js';
import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { getAdminBurialLocationsController } from './adminBurialLocationsController.factory.js';

export function adminBurialLocationsRoutes() {
  const router = Router();
  const controller = getAdminBurialLocationsController();

  router.get('/', requireAdminAuth, asyncHandler(controller.list));

  return router;
}

