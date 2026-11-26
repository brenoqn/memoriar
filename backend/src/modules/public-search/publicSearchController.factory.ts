import { getPool } from '../../db/pool.js';
import { PublicSearchController } from './publicSearch.controller.js';
import { PublicSearchUseCase } from './publicSearch.usecase.js';
import { PgPublicSearchRepository } from './repositories/pgPublicSearch.repository.js';

export function getPublicSearchController() {
  return new PublicSearchController(new PublicSearchUseCase(new PgPublicSearchRepository(getPool())));
}
