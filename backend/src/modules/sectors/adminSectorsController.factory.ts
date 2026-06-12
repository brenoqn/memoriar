import { AdminSectorsController } from './adminSectors.controller.js';
import { AdminSectorsUseCase } from './adminSectors.usecase.js';
import { MockAdminSectorsRepository } from './repositories/mockAdminSectors.repository.js';
import { SupabaseAdminSectorsRepository } from './repositories/supabaseAdminSectors.repository.js';

export function getAdminSectorsController() {
  const repo =
    process.env.USE_MOCKS === 'true' ? new MockAdminSectorsRepository() : new SupabaseAdminSectorsRepository();
  return new AdminSectorsController(new AdminSectorsUseCase(repo));
}
