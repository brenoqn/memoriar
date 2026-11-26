import { Router } from 'express';

import { asyncHandler } from '../../core/http/asyncHandler.js';
import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { getAdminQuadrasController } from './adminQuadrasController.factory.js';

export function adminQuadrasRoutes() {
  const router = Router();
  const controller = getAdminQuadrasController();

  router.get('/', requireAdminAuth, asyncHandler(controller.list));

  return router;
}

