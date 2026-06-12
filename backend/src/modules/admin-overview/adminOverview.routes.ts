import { Router } from 'express';

import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { getAdminOverviewController } from './adminOverviewController.factory.js';

export function adminOverviewRoutes() {
  const router = Router();
  const controller = getAdminOverviewController();

  router.get('/', requireAdminAuth, controller.get);

  return router;
}

