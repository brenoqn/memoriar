import type { AdminSectorListItem } from '@memoriar/shared';

import type { Queryable } from '../../../db/pool.js';
import type { AdminSectorsRepository } from '../adminSectors.usecase.js';

export class PgAdminSectorsRepository implements AdminSectorsRepository {
  constructor(private readonly db: Queryable) {}

  async list(): Promise<AdminSectorListItem[]> {
    const { rows } = await this.db.query<AdminSectorListItem>(
      `select s.id, s.cemetery_id, s.code, s.name, s.status, s.sort_order, s.created_at, s.updated_at,
              c.name as cemetery_name
         from sectors s
         join cemeteries c on c.id = s.cemetery_id
        order by s.code, s.id`
    );
    return rows;
  }
}
