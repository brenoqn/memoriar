import { Router } from 'express';

import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { getAdminBurialCasesController } from './adminBurialCasesController.factory.js';

export function adminBurialCasesRoutes() {
  const router = Router();
  const controller = getAdminBurialCasesController();

  router.get('/', requireAdminAuth, controller.list);

  return router;
}

