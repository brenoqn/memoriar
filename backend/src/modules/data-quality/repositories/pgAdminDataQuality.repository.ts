import type { AdminDataQualityIssue, AdminDataQualityResponse, DataQualityIssueType } from '@memoriar/shared';
import { createHash } from 'node:crypto';

import type { Queryable } from '../../../db/pool.js';
import type { AdminDataQualityRepository } from '../adminDataQuality.usecase.js';

function stableIssueId(type: DataQualityIssueType, entityId: string) {
  const hex = createHash('sha1').update(`${type}:${entityId}`).digest('hex').slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

type IdRow = { id: string };

export class PgAdminDataQualityRepository implements AdminDataQualityRepository {
  constructor(private readonly db: Queryable) {}

  private async ids(sql: string) {
    const { rows } = await this.db.query<IdRow>(sql);
    return rows.map((r) => r.id);
  }

  async get(): Promise<AdminDataQualityResponse> {
    const issues: AdminDataQualityIssue[] = [];

    for (const id of await this.ids(
      "select id from burial_cases where status = 'not_found_precisely' order by updated_at desc, id"
    )) {
      issues.push({
        id: stableIssueId('case_without_precise_location', id),
        type: 'case_without_precise_location',
        severity: 'warning',
        title: 'Caso sem localização precisa',
        description: 'O caso possui indícios, mas não há quadra/local confirmados.',
        entity_kind: 'burial_case',
        entity_id: id
      });
    }

    for (const id of await this.ids(
      "select id from burial_cases where status = 'in_review' order by updated_at desc, id"
    )) {
      issues.push({
        id: stableIssueId('case_in_review', id),
        type: 'case_in_review',
        severity: 'info',
        title: 'Caso em revisão',
        description: 'Registro aguardando validação antes de publicação.',
        entity_kind: 'burial_case',
        entity_id: id
      });
    }

    for (const id of await this.ids(
      "select id from burial_locations where map_node_id is null and status <> 'archived' order by code, id"
    )) {
      issues.push({
        id: stableIssueId('location_without_map_node', id),
        type: 'location_without_map_node',
        severity: 'critical',
        title: 'Local físico sem nó do mapa lógico',
        description: 'O local existe no cadastro, mas ainda não foi vinculado a um nó do mapa lógico.',
        entity_kind: 'burial_location',
        entity_id: id
      });
    }

    for (const id of await this.ids(
      'select distinct burial_case_id as id from remains_movements where is_confirmed = false order by 1'
    )) {
      issues.push({
        id: stableIssueId('legacy_record_pending_validation', id),
        type: 'legacy_record_pending_validation',
        severity: 'warning',
        title: 'Movimentação pendente de validação',
        description: 'Existe movimentação registrada sem confirmação.',
        entity_kind: 'burial_case',
        entity_id: id
      });
    }

    const summary = issues.reduce(
      (acc, i) => {
        acc.issues_total += 1;
        acc[i.severity] += 1;
        return acc;
      },
      { issues_total: 0, critical: 0, warning: 0, info: 0 }
    );

    return { issues, summary };
  }
}
