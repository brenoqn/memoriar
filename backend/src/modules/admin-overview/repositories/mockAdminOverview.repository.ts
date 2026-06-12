import { mockAdminOverview } from '../../../mocks/adminData.mock.js';
import type { AdminOverviewRepository, AdminOverviewInput } from '../adminOverview.usecase.js';

export class MockAdminOverviewRepository implements AdminOverviewRepository {
  async getOverview(_input: AdminOverviewInput) {
    return mockAdminOverview();
  }
}

