import { Router } from 'express';

import { publicSearchRoutes } from '../modules/public-search/publicSearch.routes.js';
import { mapRoutes } from '../modules/map/map.routes.js';
import { adminAuthRoutes } from '../modules/auth/adminAuth.routes.js';
import { adminCemeteriesRoutes } from '../modules/cemeteries/adminCemeteries.routes.js';
import { adminOverviewRoutes } from '../modules/admin-overview/adminOverview.routes.js';
import { adminSectorsRoutes } from '../modules/sectors/adminSectors.routes.js';
import { adminQuadrasRoutes } from '../modules/quadras/adminQuadras.routes.js';
import { adminBurialLocationsRoutes } from '../modules/burial-locations/adminBurialLocations.routes.js';
import { adminBurialCasesRoutes } from '../modules/burial-cases/adminBurialCases.routes.js';
import { adminRemainsMovementsRoutes } from '../modules/remains-movements/adminRemainsMovements.routes.js';
import { adminDataQualityRoutes } from '../modules/data-quality/adminDataQuality.routes.js';
import { adminOperationFlowRoutes } from '../modules/operation-flow/adminOperationFlow.routes.js';

export function routes() {
  const router = Router();
  router.use('/public', publicSearchRoutes());
  router.use('/public', mapRoutes());
  router.use('/admin/auth', adminAuthRoutes());
  router.use('/admin/overview', adminOverviewRoutes());
  router.use('/admin/cemeteries', adminCemeteriesRoutes());
  router.use('/admin/sectors', adminSectorsRoutes());
  router.use('/admin/quadras', adminQuadrasRoutes());
  router.use('/admin/burial-locations', adminBurialLocationsRoutes());
  router.use('/admin/burial-cases', adminBurialCasesRoutes());
  router.use('/admin/remains-movements', adminRemainsMovementsRoutes());
  router.use('/admin/data-quality', adminDataQualityRoutes());
  router.use('/admin/operation-flow', adminOperationFlowRoutes());
  return router;
}
