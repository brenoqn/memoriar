import { getPool } from '../../db/pool.js';
import { MapController } from './map.controller.js';
import { MapUseCase } from './map.usecase.js';
import { PgMapRepository } from './repositories/pgMap.repository.js';

export function getMapController() {
  return new MapController(new MapUseCase(new PgMapRepository(getPool())));
}
