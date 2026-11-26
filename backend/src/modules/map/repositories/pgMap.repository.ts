import type { MapNode } from '@memoriar/shared';

import type { Queryable } from '../../../db/pool.js';
import type { MapNodesQuery, MapRepository } from '../map.usecase.js';

export class PgMapRepository implements MapRepository {
  constructor(private readonly db: Queryable) {}

  async getMapNodes(query: MapNodesQuery): Promise<MapNode[]> {
    const { rows } = await this.db.query<MapNode>(
      `select id, cemetery_id, node_type, x, y, w, h, label
         from v_public_cemetery_map_nodes
        where cemetery_id = $1
        order by y, x, id`,
      [query.cemeteryId]
    );
    return rows;
  }
}
