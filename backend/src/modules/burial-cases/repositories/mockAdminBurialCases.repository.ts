import { MOCK_ADMIN_BURIAL_CASES } from '../../../mocks/adminData.mock.js';
import type { AdminBurialCasesRepository, AdminListBurialCasesInput } from '../adminBurialCases.usecase.js';

export class MockAdminBurialCasesRepository implements AdminBurialCasesRepository {
  async list(_input: AdminListBurialCasesInput) {
    return MOCK_ADMIN_BURIAL_CASES;
  }
}

