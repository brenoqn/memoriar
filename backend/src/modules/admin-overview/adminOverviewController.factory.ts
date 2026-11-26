import { getPool } from '../../db/pool.js';
import { AdminOverviewController } from './adminOverview.controller.js';
import { AdminOverviewUseCase } from './adminOverview.usecase.js';
import { PgAdminOverviewRepository } from './repositories/pgAdminOverview.repository.js';

export function getAdminOverviewController() {
  return new AdminOverviewController(new AdminOverviewUseCase(new PgAdminOverviewRepository(getPool())));
}
