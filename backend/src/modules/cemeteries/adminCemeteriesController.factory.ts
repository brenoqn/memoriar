import { env } from '../../core/config/env.js';
import { AdminCemeteriesController } from './adminCemeteries.controller.js';
import { AdminCemeteriesUseCase } from './adminCemeteries.usecase.js';
import { MockAdminCemeteriesRepository } from './repositories/mockAdminCemeteries.repository.js';
import { SupabaseAdminCemeteriesRepository } from './repositories/supabaseAdminCemeteries.repository.js';

export function getAdminCemeteriesController() {
  const repo = env.USE_MOCKS
    ? new MockAdminCemeteriesRepository()
    : new SupabaseAdminCemeteriesRepository();
  const useCase = new AdminCemeteriesUseCase(repo);
  return new AdminCemeteriesController(useCase);
}
