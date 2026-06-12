import type { AdminBurialCaseListItem } from '@memoriar/shared';

import type { AdminBurialCasesRepository, AdminListBurialCasesInput } from '../adminBurialCases.usecase.js';

export class NoopAdminBurialCasesRepository implements AdminBurialCasesRepository {
  async list(_input: AdminListBurialCasesInput): Promise<AdminBurialCaseListItem[]> {
    return [];
  }
}

