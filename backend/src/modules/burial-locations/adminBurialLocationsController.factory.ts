import { AdminBurialLocationsController } from './adminBurialLocations.controller.js';
import { AdminBurialLocationsUseCase } from './adminBurialLocations.usecase.js';
import { MockAdminBurialLocationsRepository } from './repositories/mockAdminBurialLocations.repository.js';
import { SupabaseAdminBurialLocationsRepository } from './repositories/supabaseAdminBurialLocations.repository.js';

export function getAdminBurialLocationsController() {
  const repo =
    process.env.USE_MOCKS === 'true'
      ? new MockAdminBurialLocationsRepository()
      : new SupabaseAdminBurialLocationsRepository();
  return new AdminBurialLocationsController(new AdminBurialLocationsUseCase(repo));
}
