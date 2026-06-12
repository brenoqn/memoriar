import type { Cemetery } from '@memoriar/shared';

import { createSupabaseAuthedClient } from '../../../integrations/supabase/supabaseClientFactory.js';
import type { AdminCemeteriesRepository, AdminListCemeteriesInput } from '../adminCemeteries.usecase.js';

export class SupabaseAdminCemeteriesRepository implements AdminCemeteriesRepository {
  async list(input: AdminListCemeteriesInput): Promise<Cemetery[]> {
    const supabase = createSupabaseAuthedClient(input.accessToken);
    const { data, error } = await supabase
      .from('cemeteries')
      .select('id,name,address,status,logical_map_note,created_at,updated_at')
      .order('name');
    if (error) return [];
    return (data || []) as unknown as Cemetery[];
  }
}
