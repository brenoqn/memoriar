import { getPool } from '../../db/pool.js';
import { AdminBurialCasesController } from './adminBurialCases.controller.js';
import { AdminBurialCasesUseCase } from './adminBurialCases.usecase.js';
import { PgAdminBurialCasesRepository } from './repositories/pgAdminBurialCases.repository.js';

export function getAdminBurialCasesController() {
  return new AdminBurialCasesController(new AdminBurialCasesUseCase(new PgAdminBurialCasesRepository(getPool())));
}
