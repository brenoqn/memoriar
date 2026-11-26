import { getPool } from '../../db/pool.js';
import { AdminSectorsController } from './adminSectors.controller.js';
import { AdminSectorsUseCase } from './adminSectors.usecase.js';
import { PgAdminSectorsRepository } from './repositories/pgAdminSectors.repository.js';

export function getAdminSectorsController() {
  return new AdminSectorsController(new AdminSectorsUseCase(new PgAdminSectorsRepository(getPool())));
}
