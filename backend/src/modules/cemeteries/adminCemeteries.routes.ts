import { Router } from 'express';

import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { getAdminCemeteriesController } from './adminCemeteriesController.factory.js';

export function adminCemeteriesRoutes() {
  const router = Router();
  const controller = getAdminCemeteriesController();

  router.get('/', requireAdminAuth, controller.list);

  return router;
}
