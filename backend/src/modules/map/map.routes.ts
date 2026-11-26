import { Router } from 'express';

import { asyncHandler } from '../../core/http/asyncHandler.js';
import { getMapController } from './mapController.factory.js';

export function mapRoutes() {
  const router = Router();
  const controller = getMapController();
  router.get('/cemeteries/:cemeteryId/map-nodes', asyncHandler(controller.getMapNodes));
  return router;
}
