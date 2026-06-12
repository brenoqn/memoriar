import type { PublicDeceasedDetail, PublicDeceasedSearchItem } from '@memoriar/shared';

import { createSupabaseAnonClient } from '../../../integrations/supabase/supabaseClientFactory.js';
import type {
  PublicSearchDetailQuery,
  PublicSearchQuery,
  PublicSearchRepository
} from '../publicSearch.usecase.js';

export class SupabasePublicSearchRepository implements PublicSearchRepository {
  async search(query: PublicSearchQuery): Promise<PublicDeceasedSearchItem[]> {
    const supabase = createSupabaseAnonClient();
    const q = query.q;

    let request = supabase
      .from('v_public_deceased_search')
      .select('*')
      .ilike('deceased_name', `%${q}%`)
      .limit(50);

    if (query.cemeteryId) {
      request = request.eq('cemetery_id', query.cemeteryId);
    }

    const { data, error } = await request;
    if (error) {
      return [];
    }
    return (data || []) as unknown as PublicDeceasedSearchItem[];
  }

  async detail(query: PublicSearchDetailQuery): Promise<PublicDeceasedDetail | null> {
    const supabase = createSupabaseAnonClient();
    const { data, error } = await supabase
      .from('v_public_deceased_detail')
      .select('*')
      .eq('burial_case_id', query.burialCaseId)
      .maybeSingle();

    if (error || !data) return null;
    return data as unknown as PublicDeceasedDetail;
  }
}
