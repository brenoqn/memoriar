import { Router } from 'express';

import { getMapController } from './mapController.factory.js';

export function mapRoutes() {
  const router = Router();
  const controller = getMapController();
  router.get('/cemeteries/:cemeteryId/map-nodes', controller.getMapNodes);
  return router;
}
