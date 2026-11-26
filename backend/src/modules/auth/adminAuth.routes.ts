import { Router } from 'express';

import { asyncHandler } from '../../core/http/asyncHandler.js';
import { getPool } from '../../db/pool.js';
import { AdminAuthController } from './adminAuth.controller.js';
import { AdminAuthUseCase } from './adminAuth.usecase.js';
import { PgAuthRepository } from './repositories/pgAuth.repository.js';

export function adminAuthRoutes() {
  const router = Router();
  const controller = new AdminAuthController(new AdminAuthUseCase(new PgAuthRepository(getPool())));

  router.post('/login', asyncHandler(controller.login));

  return router;
}
