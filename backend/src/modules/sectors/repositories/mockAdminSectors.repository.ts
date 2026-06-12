import { MOCK_ADMIN_SECTORS } from '../../../mocks/adminData.mock.js';
import type { AdminListSectorsInput, AdminSectorsRepository } from '../adminSectors.usecase.js';

export class MockAdminSectorsRepository implements AdminSectorsRepository {
  async list(_input: AdminListSectorsInput) {
    return MOCK_ADMIN_SECTORS;
  }
}

