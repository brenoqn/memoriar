import type { AdminRemainsMovementListItem } from '@memoriar/shared';

import type { Queryable } from '../../../db/pool.js';
import type { AdminRemainsMovementsRepository } from '../adminRemainsMovements.usecase.js';

export class PgAdminRemainsMovementsRepository implements AdminRemainsMovementsRepository {
  constructor(private readonly db: Queryable) {}

  async list(): Promise<AdminRemainsMovementListItem[]> {
    const { rows } = await this.db.query<AdminRemainsMovementListItem>(
      `select m.id,
              m.movement_type,
              m.occurred_on,
              m.burial_case_id,
              dp.full_name as deceased_name,
              lf.code as from_location_code,
              lt.code as to_location_code,
              m.is_confirmed,
              m.notes
         from remains_movements m
         join burial_cases bc on bc.id = m.burial_case_id
         join deceased_persons dp on dp.id = bc.deceased_person_id
         left join burial_locations lf on lf.id = m.from_location_id
         left join burial_locations lt on lt.id = m.to_location_id
        order by m.occurred_on desc nulls last, m.created_at desc, m.id`
    );
    return rows;
  }
}
