import type { AdminBurialCaseListItem } from '@memoriar/shared';

import type { Queryable } from '../../../db/pool.js';
import type { AdminBurialCasesRepository } from '../adminBurialCases.usecase.js';

export class PgAdminBurialCasesRepository implements AdminBurialCasesRepository {
  constructor(private readonly db: Queryable) {}

  async list(): Promise<AdminBurialCaseListItem[]> {
    const { rows } = await this.db.query<AdminBurialCaseListItem>(
      `select bc.id as burial_case_id,
              dp.full_name as deceased_name,
              bc.public_reference,
              bc.status,
              bc.cemetery_id,
              c.name as cemetery_name,
              cur.current_location_id,
              l.code as location_code,
              l.label as location_label,
              s.code as sector_code,
              q.code as quadra_code,
              bc.updated_at
         from burial_cases bc
         join deceased_persons dp on dp.id = bc.deceased_person_id
         join cemeteries c on c.id = bc.cemetery_id
         left join v_current_burial_case_location cur on cur.burial_case_id = bc.id
         left join burial_locations l on l.id = cur.current_location_id
         left join sectors s on s.id = l.sector_id
         left join quadras q on q.id = l.quadra_id
        order by bc.updated_at desc, bc.id`
    );
    return rows;
  }
}
