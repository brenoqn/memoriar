import { getPool } from '../../db/pool.js';
import { AdminQuadrasController } from './adminQuadras.controller.js';
import { AdminQuadrasUseCase } from './adminQuadras.usecase.js';
import { PgAdminQuadrasRepository } from './repositories/pgAdminQuadras.repository.js';

export function getAdminQuadrasController() {
  return new AdminQuadrasController(new AdminQuadrasUseCase(new PgAdminQuadrasRepository(getPool())));
}
