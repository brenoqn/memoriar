import { Router } from 'express';

import { asyncHandler } from '../../core/http/asyncHandler.js';
import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { getAdminDataQualityController } from './adminDataQualityController.factory.js';

export function adminDataQualityRoutes() {
  const router = Router();
  const controller = getAdminDataQualityController();

  router.get('/', requireAdminAuth, asyncHandler(controller.get));

  return router;
}

