import { Router } from 'express';

import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { getAdminRemainsMovementsController } from './adminRemainsMovementsController.factory.js';

export function adminRemainsMovementsRoutes() {
  const router = Router();
  const controller = getAdminRemainsMovementsController();

  router.get('/', requireAdminAuth, controller.list);

  return router;
}

