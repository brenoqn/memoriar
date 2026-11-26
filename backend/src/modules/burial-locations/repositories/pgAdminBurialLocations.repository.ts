import type { AdminBurialLocationListItem } from '@memoriar/shared';

import type { Queryable } from '../../../db/pool.js';
import type { AdminBurialLocationsRepository } from '../adminBurialLocations.usecase.js';

export class PgAdminBurialLocationsRepository implements AdminBurialLocationsRepository {
  constructor(private readonly db: Queryable) {}

  async list(): Promise<AdminBurialLocationListItem[]> {
    const { rows } = await this.db.query<AdminBurialLocationListItem>(
      `select l.id, l.cemetery_id, l.sector_id, l.quadra_id, l.alley_id, l.type_id, l.parent_location_id,
              l.map_node_id, l.code, l.label, l.location_text, l.status, l.created_at, l.updated_at,
              c.name as cemetery_name,
              s.code as sector_code,
              s.name as sector_name,
              q.code as quadra_code,
              q.name as quadra_name,
              t.code as type_code,
              t.label as type_label,
              t.kind,
              t.default_capacity,
              t.allows_multiple
         from burial_locations l
         join cemeteries c on c.id = l.cemetery_id
         join sectors s on s.id = l.sector_id
         left join quadras q on q.id = l.quadra_id
         join burial_location_types t on t.id = l.type_id
        order by l.code, l.id`
    );
    return rows;
  }
}
