import { env } from '../../core/config/env.js';
import { PublicSearchController } from './publicSearch.controller.js';
import { PublicSearchUseCase } from './publicSearch.usecase.js';
import { MockPublicSearchRepository } from './repositories/mockPublicSearch.repository.js';
import { SupabasePublicSearchRepository } from './repositories/supabasePublicSearch.repository.js';

export function getPublicSearchController() {
  const repo = env.USE_MOCKS
    ? new MockPublicSearchRepository()
    : new SupabasePublicSearchRepository();
  const useCase = new PublicSearchUseCase(repo);
  return new PublicSearchController(useCase);
}
