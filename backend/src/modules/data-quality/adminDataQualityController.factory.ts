import { AdminDataQualityController } from './adminDataQuality.controller.js';
import { AdminDataQualityUseCase } from './adminDataQuality.usecase.js';
import { MockAdminDataQualityRepository } from './repositories/mockAdminDataQuality.repository.js';
import { SupabaseAdminDataQualityRepository } from './repositories/supabaseAdminDataQuality.repository.js';

export function getAdminDataQualityController() {
  const repo =
    process.env.USE_MOCKS === 'true'
      ? new MockAdminDataQualityRepository()
      : new SupabaseAdminDataQualityRepository();
  return new AdminDataQualityController(new AdminDataQualityUseCase(repo));
}
