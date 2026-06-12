import { Router } from 'express';

import { getPublicSearchController } from './publicSearchController.factory.js';

export function publicSearchRoutes() {
  const router = Router();
  const controller = getPublicSearchController();

  router.get('/search', controller.search);
  router.get('/cases/:id', controller.detail);

  return router;
}
