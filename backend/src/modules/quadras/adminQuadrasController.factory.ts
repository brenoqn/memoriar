import { AdminQuadrasController } from './adminQuadras.controller.js';
import { AdminQuadrasUseCase } from './adminQuadras.usecase.js';
import { MockAdminQuadrasRepository } from './repositories/mockAdminQuadras.repository.js';
import { SupabaseAdminQuadrasRepository } from './repositories/supabaseAdminQuadras.repository.js';

export function getAdminQuadrasController() {
  const repo =
    process.env.USE_MOCKS === 'true' ? new MockAdminQuadrasRepository() : new SupabaseAdminQuadrasRepository();
  return new AdminQuadrasController(new AdminQuadrasUseCase(repo));
}
