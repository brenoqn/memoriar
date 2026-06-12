import { AdminBurialCasesController } from './adminBurialCases.controller.js';
import { AdminBurialCasesUseCase } from './adminBurialCases.usecase.js';
import { MockAdminBurialCasesRepository } from './repositories/mockAdminBurialCases.repository.js';
import { SupabaseAdminBurialCasesRepository } from './repositories/supabaseAdminBurialCases.repository.js';

export function getAdminBurialCasesController() {
  const repo =
    process.env.USE_MOCKS === 'true'
      ? new MockAdminBurialCasesRepository()
      : new SupabaseAdminBurialCasesRepository();
  return new AdminBurialCasesController(new AdminBurialCasesUseCase(repo));
}
