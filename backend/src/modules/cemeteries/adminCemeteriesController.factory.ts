import { getPool } from '../../db/pool.js';
import { AdminCemeteriesController } from './adminCemeteries.controller.js';
import { AdminCemeteriesUseCase } from './adminCemeteries.usecase.js';
import { PgAdminCemeteriesRepository } from './repositories/pgAdminCemeteries.repository.js';

export function getAdminCemeteriesController() {
  return new AdminCemeteriesController(new AdminCemeteriesUseCase(new PgAdminCemeteriesRepository(getPool())));
}
