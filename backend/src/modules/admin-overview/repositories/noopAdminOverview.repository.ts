import type { AdminOverview } from '@memoriar/shared';

import type { AdminOverviewRepository, AdminOverviewInput } from '../adminOverview.usecase.js';

export class NoopAdminOverviewRepository implements AdminOverviewRepository {
  async getOverview(_input: AdminOverviewInput): Promise<AdminOverview> {
    return {
      cemeteries_count: 0,
      burial_locations_count: 0,
      burial_cases_published_count: 0,
      burial_cases_in_review_count: 0,
      burial_cases_not_found_precisely_count: 0
    };
  }
}

