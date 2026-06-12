import type { AdminOverview } from '@memoriar/shared';

import { createSupabaseAuthedClient } from '../../../integrations/supabase/supabaseClientFactory.js';
import type { AdminOverviewInput, AdminOverviewRepository } from '../adminOverview.usecase.js';

export class SupabaseAdminOverviewRepository implements AdminOverviewRepository {
  async getOverview(input: AdminOverviewInput): Promise<AdminOverview> {
    const supabase = createSupabaseAuthedClient(input.accessToken);

    const { count: cemeteriesCount } = await supabase
      .from('cemeteries')
      .select('*', { count: 'exact', head: true });

    const { count: burialLocationsCount } = await supabase
      .from('burial_locations')
      .select('*', { count: 'exact', head: true });

    const countCasesByStatus = async (status: string) => {
      const { count } = await supabase
        .from('burial_cases')
        .select('*', { count: 'exact', head: true })
        .eq('status', status);
      return count ?? 0;
    };

    return {
      cemeteries_count: cemeteriesCount ?? 0,
      burial_locations_count: burialLocationsCount ?? 0,
      burial_cases_published_count: await countCasesByStatus('published'),
      burial_cases_in_review_count: await countCasesByStatus('in_review'),
      burial_cases_not_found_precisely_count: await countCasesByStatus('not_found_precisely')
    };
  }
}
