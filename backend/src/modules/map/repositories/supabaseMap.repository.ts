import type { MapNode } from '@memoriar/shared';

import { createSupabaseAnonClient } from '../../../integrations/supabase/supabaseClientFactory.js';
import type { MapNodesQuery, MapRepository } from '../map.usecase.js';

export class SupabaseMapRepository implements MapRepository {
  async getMapNodes(query: MapNodesQuery): Promise<MapNode[]> {
    const supabase = createSupabaseAnonClient();
    const { data, error } = await supabase
      .from('v_public_cemetery_map_nodes')
      .select('*')
      .eq('cemetery_id', query.cemeteryId);

    if (error) return [];
    return (data || []) as unknown as MapNode[];
  }
}
