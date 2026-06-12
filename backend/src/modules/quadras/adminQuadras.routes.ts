import { Router } from 'express';

import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { getAdminQuadrasController } from './adminQuadrasController.factory.js';

export function adminQuadrasRoutes() {
  const router = Router();
  const controller = getAdminQuadrasController();

  router.get('/', requireAdminAuth, controller.list);

  return router;
}

