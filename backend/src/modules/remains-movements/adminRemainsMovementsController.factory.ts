import { AdminRemainsMovementsController } from './adminRemainsMovements.controller.js';
import { AdminRemainsMovementsUseCase } from './adminRemainsMovements.usecase.js';
import { MockAdminRemainsMovementsRepository } from './repositories/mockAdminRemainsMovements.repository.js';
import { SupabaseAdminRemainsMovementsRepository } from './repositories/supabaseAdminRemainsMovements.repository.js';

export function getAdminRemainsMovementsController() {
  const repo =
    process.env.USE_MOCKS === 'true'
      ? new MockAdminRemainsMovementsRepository()
      : new SupabaseAdminRemainsMovementsRepository();
  return new AdminRemainsMovementsController(new AdminRemainsMovementsUseCase(repo));
}
