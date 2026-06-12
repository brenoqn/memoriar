import { MOCK_ADMIN_REMAINS_MOVEMENTS } from '../../../mocks/adminData.mock.js';
import type {
  AdminListRemainsMovementsInput,
  AdminRemainsMovementsRepository
} from '../adminRemainsMovements.usecase.js';

export class MockAdminRemainsMovementsRepository implements AdminRemainsMovementsRepository {
  async list(_input: AdminListRemainsMovementsInput) {
    return MOCK_ADMIN_REMAINS_MOVEMENTS;
  }
}

