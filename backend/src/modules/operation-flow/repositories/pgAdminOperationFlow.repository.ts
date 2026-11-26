import type { Queryable } from '../../../db/pool.js';
import type {
  AdminOperationFlowRepository,
  OperationFlowLocationSummary
} from '../adminOperationFlow.usecase.js';

export class PgAdminOperationFlowRepository implements AdminOperationFlowRepository {
  constructor(private readonly db: Queryable) {}

  async findLocationSummary(locationId: string): Promise<OperationFlowLocationSummary | null> {
    const { rows } = await this.db.query<OperationFlowLocationSummary>(
      `select l.code, s.code as sector_code, q.code as quadra_code, l.map_node_id
         from burial_locations l
         join sectors s on s.id = l.sector_id
         left join quadras q on q.id = l.quadra_id
        where l.id = $1
        limit 1`,
      [locationId]
    );
    return rows[0] ?? null;
  }
}
