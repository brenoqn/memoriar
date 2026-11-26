import type { AdminOverview } from '@memoriar/shared';

import type { Queryable } from '../../../db/pool.js';
import type { AdminOverviewRepository } from '../adminOverview.usecase.js';

export class PgAdminOverviewRepository implements AdminOverviewRepository {
  constructor(private readonly db: Queryable) {}

  async getOverview(): Promise<AdminOverview> {
    const { rows } = await this.db.query<AdminOverview>(
      `select
         (select count(*) from cemeteries) as cemeteries_count,
         (select count(*) from burial_locations) as burial_locations_count,
         (select count(*) from burial_cases where status = 'published') as burial_cases_published_count,
         (select count(*) from burial_cases where status = 'in_review') as burial_cases_in_review_count,
         (select count(*) from burial_cases where status = 'not_found_precisely')
           as burial_cases_not_found_precisely_count`
    );
    return rows[0];
  }
}
