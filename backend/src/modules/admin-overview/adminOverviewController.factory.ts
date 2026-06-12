import { AdminOverviewController } from './adminOverview.controller.js';
import { AdminOverviewUseCase } from './adminOverview.usecase.js';
import { MockAdminOverviewRepository } from './repositories/mockAdminOverview.repository.js';
import { SupabaseAdminOverviewRepository } from './repositories/supabaseAdminOverview.repository.js';

export function getAdminOverviewController() {
  const repo =
    process.env.USE_MOCKS === 'true'
      ? new MockAdminOverviewRepository()
      : new SupabaseAdminOverviewRepository();
  return new AdminOverviewController(new AdminOverviewUseCase(repo));
}
