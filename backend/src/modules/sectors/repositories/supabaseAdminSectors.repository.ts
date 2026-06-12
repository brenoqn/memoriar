import type { AdminSectorListItem } from '@memoriar/shared';

import { createSupabaseAuthedClient } from '../../../integrations/supabase/supabaseClientFactory.js';
import type { AdminListSectorsInput, AdminSectorsRepository } from '../adminSectors.usecase.js';

type SectorRow = Omit<AdminSectorListItem, 'cemetery_name'> & {
  cemeteries: { name: string } | null;
};

export class SupabaseAdminSectorsRepository implements AdminSectorsRepository {
  async list(input: AdminListSectorsInput): Promise<AdminSectorListItem[]> {
    const supabase = createSupabaseAuthedClient(input.accessToken);
    const { data, error } = await supabase
      .from('sectors')
      .select('id,cemetery_id,code,name,status,sort_order,created_at,updated_at,cemeteries(name)')
      .order('code');
    if (error) return [];

    return ((data || []) as unknown as SectorRow[]).map((s) => ({
      id: s.id,
      cemetery_id: s.cemetery_id,
      code: s.code,
      name: s.name,
      status: s.status,
      sort_order: s.sort_order,
      created_at: s.created_at,
      updated_at: s.updated_at,
      cemetery_name: s.cemeteries?.name ?? ''
    }));
  }
}
