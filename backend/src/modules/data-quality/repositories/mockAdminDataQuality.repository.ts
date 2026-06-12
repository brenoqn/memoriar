import { mockAdminDataQuality } from '../../../mocks/adminData.mock.js';
import type { AdminDataQualityInput, AdminDataQualityRepository } from '../adminDataQuality.usecase.js';

export class MockAdminDataQualityRepository implements AdminDataQualityRepository {
  async get(_input: AdminDataQualityInput) {
    return mockAdminDataQuality();
  }
}

