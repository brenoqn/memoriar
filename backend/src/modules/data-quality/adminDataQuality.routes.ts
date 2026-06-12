import { Router } from 'express';

import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { getAdminDataQualityController } from './adminDataQualityController.factory.js';

export function adminDataQualityRoutes() {
  const router = Router();
  const controller = getAdminDataQualityController();

  router.get('/', requireAdminAuth, controller.get);

  return router;
}

