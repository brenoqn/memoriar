import type { AdminQuadraListItem } from '@memoriar/shared';

import { createSupabaseAuthedClient } from '../../../integrations/supabase/supabaseClientFactory.js';
import type { AdminListQuadrasInput, AdminQuadrasRepository } from '../adminQuadras.usecase.js';

type QuadraRow = Omit<AdminQuadraListItem, 'sector_code' | 'cemetery_id' | 'cemetery_name'> & {
  sectors: { code: string; cemetery_id: string; cemeteries: { name: string } | null } | null;
};

export class SupabaseAdminQuadrasRepository implements AdminQuadrasRepository {
  async list(input: AdminListQuadrasInput): Promise<AdminQuadraListItem[]> {
    const supabase = createSupabaseAuthedClient(input.accessToken);
    const { data, error } = await supabase
      .from('quadras')
      .select(
        'id,sector_id,code,name,status,sort_order,created_at,updated_at,sectors(code,cemetery_id,cemeteries(name))'
      )
      .order('code');
    if (error) return [];

    return ((data || []) as unknown as QuadraRow[]).map((q) => ({
      id: q.id,
      sector_id: q.sector_id,
      code: q.code,
      name: q.name,
      status: q.status,
      sort_order: q.sort_order,
      created_at: q.created_at,
      updated_at: q.updated_at,
      sector_code: q.sectors?.code ?? '',
      cemetery_id: q.sectors?.cemetery_id ?? '',
      cemetery_name: q.sectors?.cemeteries?.name ?? ''
    }));
  }
}
