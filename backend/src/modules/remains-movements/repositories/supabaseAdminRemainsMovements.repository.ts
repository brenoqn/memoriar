import type { AdminRemainsMovementListItem } from '@memoriar/shared';

import { createSupabaseAuthedClient } from '../../../integrations/supabase/supabaseClientFactory.js';
import type {
  AdminListRemainsMovementsInput,
  AdminRemainsMovementsRepository
} from '../adminRemainsMovements.usecase.js';

type MovementRow = Omit<
  AdminRemainsMovementListItem,
  'deceased_name' | 'from_location_code' | 'to_location_code'
> & {
  from_location_id: string | null;
  to_location_id: string | null;
  burial_cases: { deceased_persons: { full_name: string } | null } | null;
};

type LocationRow = { id: string; code: string };

export class SupabaseAdminRemainsMovementsRepository implements AdminRemainsMovementsRepository {
  async list(input: AdminListRemainsMovementsInput): Promise<AdminRemainsMovementListItem[]> {
    const supabase = createSupabaseAuthedClient(input.accessToken);
    const { data, error } = await supabase
      .from('remains_movements')
      .select(
        'id,movement_type,occurred_on,burial_case_id,from_location_id,to_location_id,is_confirmed,notes,burial_cases(deceased_persons(full_name))'
      )
      .order('occurred_on', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) return [];

    const rows = (data || []) as unknown as MovementRow[];
    const locationIds = Array.from(
      new Set(
        rows
          .flatMap((m) => [m.from_location_id, m.to_location_id])
          .filter((v): v is string => Boolean(v))
      )
    );

    const { data: locationsData } =
      locationIds.length > 0
        ? await supabase.from('burial_locations').select('id,code').in('id', locationIds)
        : { data: [] };
    const locationById = new Map<string, LocationRow>(
      ((locationsData || []) as unknown as LocationRow[]).map((l) => [l.id, l])
    );

    return rows.map((m) => ({
      id: m.id,
      movement_type: m.movement_type,
      occurred_on: m.occurred_on,
      burial_case_id: m.burial_case_id,
      deceased_name: m.burial_cases?.deceased_persons?.full_name ?? '',
      from_location_code: m.from_location_id ? locationById.get(m.from_location_id)?.code ?? null : null,
      to_location_code: m.to_location_id ? locationById.get(m.to_location_id)?.code ?? null : null,
      is_confirmed: m.is_confirmed,
      notes: m.notes
    }));
  }
}
