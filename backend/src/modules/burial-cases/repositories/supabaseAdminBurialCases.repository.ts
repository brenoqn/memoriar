import type { AdminBurialCaseListItem } from '@memoriar/shared';

import { createSupabaseAuthedClient } from '../../../integrations/supabase/supabaseClientFactory.js';
import type { AdminBurialCasesRepository, AdminListBurialCasesInput } from '../adminBurialCases.usecase.js';

type CaseRow = {
  id: string;
  public_reference: string | null;
  status: AdminBurialCaseListItem['status'];
  cemetery_id: string;
  updated_at: string;
  deceased_persons: { full_name: string } | null;
  cemeteries: { name: string } | null;
};

type CurrentLocationRow = {
  burial_case_id: string;
  current_location_id: string | null;
};

type LocationRow = {
  id: string;
  code: string;
  label: string | null;
  sector_id: string;
  quadra_id: string | null;
};

type SectorRow = { id: string; code: string };
type QuadraRow = { id: string; code: string };

export class SupabaseAdminBurialCasesRepository implements AdminBurialCasesRepository {
  async list(input: AdminListBurialCasesInput): Promise<AdminBurialCaseListItem[]> {
    const supabase = createSupabaseAuthedClient(input.accessToken);

    const { data: casesData, error: casesError } = await supabase
      .from('burial_cases')
      .select('id,public_reference,status,cemetery_id,updated_at,deceased_persons(full_name),cemeteries(name)')
      .order('updated_at', { ascending: false });
    if (casesError) return [];

    const cases = (casesData || []) as unknown as CaseRow[];
    const caseIds = cases.map((c) => c.id);
    if (caseIds.length === 0) return [];

    const { data: currentLocData } = await supabase
      .from('v_current_burial_case_location')
      .select('burial_case_id,current_location_id')
      .in('burial_case_id', caseIds);

    const currentLocationByCaseId = new Map<string, string | null>(
      ((currentLocData || []) as unknown as CurrentLocationRow[]).map((r) => [
        r.burial_case_id,
        r.current_location_id
      ])
    );

    const locationIds = Array.from(new Set(Array.from(currentLocationByCaseId.values()).filter(Boolean))) as string[];

    const { data: locationsData } =
      locationIds.length > 0
        ? await supabase
            .from('burial_locations')
            .select('id,code,label,sector_id,quadra_id')
            .in('id', locationIds)
        : { data: [] };

    const locations = (locationsData || []) as unknown as LocationRow[];
    const locationById = new Map<string, LocationRow>(locations.map((l) => [l.id, l]));

    const sectorIds = Array.from(new Set(locations.map((l) => l.sector_id)));
    const quadraIds = Array.from(new Set(locations.map((l) => l.quadra_id).filter(Boolean))) as string[];

    const { data: sectorsData } =
      sectorIds.length > 0
        ? await supabase.from('sectors').select('id,code').in('id', sectorIds)
        : { data: [] };
    const sectorById = new Map<string, SectorRow>(
      ((sectorsData || []) as unknown as SectorRow[]).map((s) => [s.id, s])
    );

    const { data: quadrasData } =
      quadraIds.length > 0 ? await supabase.from('quadras').select('id,code').in('id', quadraIds) : { data: [] };
    const quadraById = new Map<string, QuadraRow>(
      ((quadrasData || []) as unknown as QuadraRow[]).map((q) => [q.id, q])
    );

    return cases.map((c) => {
      const currentLocationId = currentLocationByCaseId.get(c.id) ?? null;
      const location = currentLocationId ? locationById.get(currentLocationId) : undefined;

      return {
        burial_case_id: c.id,
        deceased_name: c.deceased_persons?.full_name ?? '',
        public_reference: c.public_reference,
        status: c.status,
        cemetery_id: c.cemetery_id,
        cemetery_name: c.cemeteries?.name ?? '',
        current_location_id: currentLocationId,
        location_code: location?.code ?? null,
        location_label: location?.label ?? null,
        sector_code: location ? sectorById.get(location.sector_id)?.code ?? null : null,
        quadra_code: location?.quadra_id ? quadraById.get(location.quadra_id)?.code ?? null : null,
        updated_at: c.updated_at
      };
    });
  }
}
