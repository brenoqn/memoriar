import { env } from '../../core/config/env.js';
import { MapController } from './map.controller.js';
import { MapUseCase } from './map.usecase.js';
import { MockMapRepository } from './repositories/mockMap.repository.js';
import { SupabaseMapRepository } from './repositories/supabaseMap.repository.js';

export function getMapController() {
  const repo = env.USE_MOCKS ? new MockMapRepository() : new SupabaseMapRepository();
  const useCase = new MapUseCase(repo);
  return new MapController(useCase);
}
