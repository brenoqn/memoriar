import { MOCK_ADMIN_QUADRAS } from '../../../mocks/adminData.mock.js';
import type { AdminListQuadrasInput, AdminQuadrasRepository } from '../adminQuadras.usecase.js';

export class MockAdminQuadrasRepository implements AdminQuadrasRepository {
  async list(_input: AdminListQuadrasInput) {
    return MOCK_ADMIN_QUADRAS;
  }
}

