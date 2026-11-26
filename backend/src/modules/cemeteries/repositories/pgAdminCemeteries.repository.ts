import type { Cemetery } from '@memoriar/shared';

import type { Queryable } from '../../../db/pool.js';
import type { AdminCemeteriesRepository } from '../adminCemeteries.usecase.js';

export class PgAdminCemeteriesRepository implements AdminCemeteriesRepository {
  constructor(private readonly db: Queryable) {}

  async list(): Promise<Cemetery[]> {
    const { rows } = await this.db.query<Cemetery>(
      `select id, name, address, status, logical_map_note, created_at, updated_at
         from cemeteries
        order by name, id`
    );
    return rows;
  }
}
