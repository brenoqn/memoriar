import { Router } from 'express';

import { requireAdminAuth } from '../../middlewares/adminAuth.middleware.js';
import { getAdminSectorsController } from './adminSectorsController.factory.js';

export function adminSectorsRoutes() {
  const router = Router();
  const controller = getAdminSectorsController();

  router.get('/', requireAdminAuth, controller.list);

  return router;
}

