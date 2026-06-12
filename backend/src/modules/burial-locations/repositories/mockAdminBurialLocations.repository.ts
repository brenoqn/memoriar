import { MOCK_ADMIN_BURIAL_LOCATIONS } from '../../../mocks/adminData.mock.js';
import type {
  AdminBurialLocationsRepository,
  AdminListBurialLocationsInput
} from '../adminBurialLocations.usecase.js';

export class MockAdminBurialLocationsRepository implements AdminBurialLocationsRepository {
  async list(_input: AdminListBurialLocationsInput) {
    return MOCK_ADMIN_BURIAL_LOCATIONS;
  }
}

