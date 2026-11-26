import { getPool } from '../../db/pool.js';
import { AdminRemainsMovementsController } from './adminRemainsMovements.controller.js';
import { AdminRemainsMovementsUseCase } from './adminRemainsMovements.usecase.js';
import { PgAdminRemainsMovementsRepository } from './repositories/pgAdminRemainsMovements.repository.js';

export function getAdminRemainsMovementsController() {
  return new AdminRemainsMovementsController(new AdminRemainsMovementsUseCase(new PgAdminRemainsMovementsRepository(getPool())));
}
