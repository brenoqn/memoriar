import type { AdminDataQualityIssue, AdminDataQualityResponse, DataQualityIssueType } from '@memoriar/shared';
import { createHash } from 'node:crypto';

import { createSupabaseAuthedClient } from '../../../integrations/supabase/supabaseClientFactory.js';
import type { AdminDataQualityInput, AdminDataQualityRepository } from '../adminDataQuality.usecase.js';

function stableIssueId(type: DataQualityIssueType, entityId: string) {
  const hex = createHash('sha1').update(`${type}:${entityId}`).digest('hex').slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export class SupabaseAdminDataQualityRepository implements AdminDataQualityRepository {
  async get(input: AdminDataQualityInput): Promise<AdminDataQualityResponse> {
    const supabase = createSupabaseAuthedClient(input.accessToken);

    const issues: AdminDataQualityIssue[] = [];

    const { data: notFoundCases } = await supabase
      .from('burial_cases')
      .select('id')
      .eq('status', 'not_found_precisely');

    for (const row of (notFoundCases || []) as unknown as Array<{ id: string }>) {
      issues.push({
        id: stableIssueId('case_without_precise_location', row.id),
        type: 'case_without_precise_location',
        severity: 'warning',
        title: 'Caso sem localização precisa',
        description: 'O caso possui indícios, mas não há quadra/local confirmados.',
        entity_kind: 'burial_case',
        entity_id: row.id
      });
    }

    const { data: inReviewCases } = await supabase.from('burial_cases').select('id').eq('status', 'in_review');
    for (const row of (inReviewCases || []) as unknown as Array<{ id: string }>) {
      issues.push({
        id: stableIssueId('case_in_review', row.id),
        type: 'case_in_review',
        severity: 'info',
        title: 'Caso em revisão',
        description: 'Registro aguardando validação antes de publicação.',
        entity_kind: 'burial_case',
        entity_id: row.id
      });
    }

    const { data: locationsWithoutMapNode } = await supabase
      .from('burial_locations')
      .select('id')
      .is('map_node_id', null)
      .neq('status', 'archived');
    for (const row of (locationsWithoutMapNode || []) as unknown as Array<{ id: string }>) {
      issues.push({
        id: stableIssueId('location_without_map_node', row.id),
        type: 'location_without_map_node',
        severity: 'critical',
        title: 'Local físico sem nó do mapa lógico',
        description: 'O local existe no cadastro, mas ainda não foi vinculado a um nó do mapa lógico.',
        entity_kind: 'burial_location',
        entity_id: row.id
      });
    }

    const { data: unconfirmedMovements } = await supabase
      .from('remains_movements')
      .select('burial_case_id')
      .eq('is_confirmed', false);
    const uniqueCaseIds = Array.from(
      new Set((unconfirmedMovements || []).map((m) => (m as { burial_case_id: string }).burial_case_id))
    );
    for (const caseId of uniqueCaseIds) {
      issues.push({
        id: stableIssueId('legacy_record_pending_validation', caseId),
        type: 'legacy_record_pending_validation',
        severity: 'warning',
        title: 'Movimentação pendente de validação',
        description: 'Existe movimentação registrada sem confirmação.',
        entity_kind: 'burial_case',
        entity_id: caseId
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
