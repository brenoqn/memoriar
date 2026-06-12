import type { AdminQuadraListItem } from '@memoriar/shared';

import type { AdminListQuadrasInput, AdminQuadrasRepository } from '../adminQuadras.usecase.js';

export class NoopAdminQuadrasRepository implements AdminQuadrasRepository {
  async list(_input: AdminListQuadrasInput): Promise<AdminQuadraListItem[]> {
    return [];
  }
}

