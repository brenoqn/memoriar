import type { AdminBurialLocationListItem } from '@memoriar/shared';

import { createSupabaseAuthedClient } from '../../../integrations/supabase/supabaseClientFactory.js';
import type {
  AdminBurialLocationsRepository,
  AdminListBurialLocationsInput
} from '../adminBurialLocations.usecase.js';

type BurialLocationRow = Omit<
  AdminBurialLocationListItem,
  | 'cemetery_name'
  | 'sector_code'
  | 'sector_name'
  | 'quadra_code'
  | 'quadra_name'
  | 'type_code'
  | 'type_label'
  | 'kind'
  | 'default_capacity'
  | 'allows_multiple'
> & {
  cemeteries: { name: string } | null;
  sectors: { code: string; name: string } | null;
  quadras: { code: string; name: string | null } | null;
  burial_location_types:
    | {
        code: string;
        label: string;
        kind: string;
        default_capacity: number;
        allows_multiple: boolean;
      }
    | null;
};

export class SupabaseAdminBurialLocationsRepository implements AdminBurialLocationsRepository {
  async list(input: AdminListBurialLocationsInput): Promise<AdminBurialLocationListItem[]> {
    const supabase = createSupabaseAuthedClient(input.accessToken);
    const { data, error } = await supabase
      .from('burial_locations')
      .select(
        'id,cemetery_id,sector_id,quadra_id,alley_id,type_id,parent_location_id,map_node_id,code,label,location_text,status,created_at,updated_at,cemeteries(name),sectors(code,name),quadras(code,name),burial_location_types(code,label,kind,default_capacity,allows_multiple)'
      )
      .order('code');
    if (error) return [];

    return ((data || []) as unknown as BurialLocationRow[]).map((l) => ({
      id: l.id,
      cemetery_id: l.cemetery_id,
      sector_id: l.sector_id,
      quadra_id: l.quadra_id,
      alley_id: l.alley_id,
      type_id: l.type_id,
      parent_location_id: l.parent_location_id,
      map_node_id: l.map_node_id,
      code: l.code,
      label: l.label,
      location_text: l.location_text,
      status: l.status,
      created_at: l.created_at,
      updated_at: l.updated_at,
      cemetery_name: l.cemeteries?.name ?? '',
      sector_code: l.sectors?.code ?? '',
      sector_name: l.sectors?.name ?? '',
      quadra_code: l.quadras?.code ?? null,
      quadra_name: l.quadras?.name ?? null,
      type_code: l.burial_location_types?.code ?? '',
      type_label: l.burial_location_types?.label ?? '',
      kind: (l.burial_location_types?.kind ?? 'other') as AdminBurialLocationListItem['kind'],
      default_capacity: l.burial_location_types?.default_capacity ?? 0,
      allows_multiple: l.burial_location_types?.allows_multiple ?? false
    }));
  }
}
