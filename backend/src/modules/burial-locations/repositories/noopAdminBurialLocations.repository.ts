import type { AdminBurialLocationListItem } from '@memoriar/shared';

import type {
  AdminBurialLocationsRepository,
  AdminListBurialLocationsInput
} from '../adminBurialLocations.usecase.js';

export class NoopAdminBurialLocationsRepository implements AdminBurialLocationsRepository {
  async list(_input: AdminListBurialLocationsInput): Promise<AdminBurialLocationListItem[]> {
    return [];
  }
}

