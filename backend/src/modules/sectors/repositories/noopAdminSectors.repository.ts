import type { AdminSectorListItem } from '@memoriar/shared';

import type { AdminListSectorsInput, AdminSectorsRepository } from '../adminSectors.usecase.js';

export class NoopAdminSectorsRepository implements AdminSectorsRepository {
  async list(_input: AdminListSectorsInput): Promise<AdminSectorListItem[]> {
    return [];
  }
}

