import type { AdminQuadraListItem } from '@memoriar/shared';

import type { Queryable } from '../../../db/pool.js';
import type { AdminQuadrasRepository } from '../adminQuadras.usecase.js';

export class PgAdminQuadrasRepository implements AdminQuadrasRepository {
  constructor(private readonly db: Queryable) {}

  async list(): Promise<AdminQuadraListItem[]> {
    const { rows } = await this.db.query<AdminQuadraListItem>(
      `select q.id, q.sector_id, q.code, q.name, q.status, q.sort_order, q.created_at, q.updated_at,
              s.code as sector_code, s.cemetery_id, c.name as cemetery_name
         from quadras q
         join sectors s on s.id = q.sector_id
         join cemeteries c on c.id = s.cemetery_id
        order by q.code, q.id`
    );
    return rows;
  }
}
