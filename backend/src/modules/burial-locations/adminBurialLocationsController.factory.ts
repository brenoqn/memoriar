import { getPool } from '../../db/pool.js';
import { AdminBurialLocationsController } from './adminBurialLocations.controller.js';
import { AdminBurialLocationsUseCase } from './adminBurialLocations.usecase.js';
import { PgAdminBurialLocationsRepository } from './repositories/pgAdminBurialLocations.repository.js';

export function getAdminBurialLocationsController() {
  return new AdminBurialLocationsController(new AdminBurialLocationsUseCase(new PgAdminBurialLocationsRepository(getPool())));
}
