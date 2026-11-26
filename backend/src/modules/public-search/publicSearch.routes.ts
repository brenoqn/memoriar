import { Router } from 'express';

import { asyncHandler } from '../../core/http/asyncHandler.js';
import { getPublicSearchController } from './publicSearchController.factory.js';

export function publicSearchRoutes() {
  const router = Router();
  const controller = getPublicSearchController();

  router.get('/search', asyncHandler(controller.search));
  router.get('/cases/:id', asyncHandler(controller.detail));

  return router;
}
