import { getPool } from '../../db/pool.js';
import { AdminDataQualityController } from './adminDataQuality.controller.js';
import { AdminDataQualityUseCase } from './adminDataQuality.usecase.js';
import { PgAdminDataQualityRepository } from './repositories/pgAdminDataQuality.repository.js';

export function getAdminDataQualityController() {
  return new AdminDataQualityController(new AdminDataQualityUseCase(new PgAdminDataQualityRepository(getPool())));
}
