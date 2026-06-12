import { Router } from 'express';

import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { getAdminBurialLocationsController } from './adminBurialLocationsController.factory.js';

export function adminBurialLocationsRoutes() {
  const router = Router();
  const controller = getAdminBurialLocationsController();

  router.get('/', requireAdminAuth, controller.list);

  return router;
}

