import type { AdminRemainsMovementListItem } from '@memoriar/shared';

import type {
  AdminListRemainsMovementsInput,
  AdminRemainsMovementsRepository
} from '../adminRemainsMovements.usecase.js';

export class NoopAdminRemainsMovementsRepository implements AdminRemainsMovementsRepository {
  async list(_input: AdminListRemainsMovementsInput): Promise<AdminRemainsMovementListItem[]> {
    return [];
  }
}

