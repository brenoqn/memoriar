import { Router } from 'express';

import { AdminAuthController } from './adminAuth.controller.js';
import { AdminAuthUseCase } from './adminAuth.usecase.js';
import { MockAuthRepository } from './repositories/mockAuth.repository.js';
import { SupabaseAuthRepository } from './repositories/supabaseAuth.repository.js';

export function adminAuthRoutes() {
  const router = Router();
  const repo =
    process.env.USE_MOCKS === 'true' ? new MockAuthRepository() : new SupabaseAuthRepository();
  const controller = new AdminAuthController(new AdminAuthUseCase(repo));

  router.post('/login', controller.login);

  return router;
}
