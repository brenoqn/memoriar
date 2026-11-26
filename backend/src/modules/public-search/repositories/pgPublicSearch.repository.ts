import type { PublicDeceasedDetail, PublicDeceasedSearchItem } from '@memoriar/shared';

import type { Queryable } from '../../../db/pool.js';
import type {
  PublicSearchDetailQuery,
  PublicSearchQuery,
  PublicSearchRepository
} from '../publicSearch.usecase.js';

const SEARCH_LIMIT = 50;

/** Escapa curingas do LIKE para que '%' e '_' digitados sejam tratados como texto. */
function likePattern(term: string) {
  return `%${term.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

export class PgPublicSearchRepository implements PublicSearchRepository {
  constructor(private readonly db: Queryable) {}

  async search(query: PublicSearchQuery): Promise<PublicDeceasedSearchItem[]> {
    const { rows } = await this.db.query<PublicDeceasedSearchItem>(
      `select *
         from v_public_deceased_search
        where (deceased_name ilike $1
               or public_reference ilike $1
               or location_code ilike $1)
          and ($2::uuid is null or cemetery_id = $2::uuid)
        order by deceased_name, burial_case_id
        limit ${SEARCH_LIMIT}`,
      [likePattern(query.q), query.cemeteryId ?? null]
    );
    return rows;
  }

  async detail(query: PublicSearchDetailQuery): Promise<PublicDeceasedDetail | null> {
    const { rows } = await this.db.query<PublicDeceasedDetail>(
      'select * from v_public_deceased_detail where burial_case_id = $1 limit 1',
      [query.burialCaseId]
    );
    return rows[0] ?? null;
  }
}
