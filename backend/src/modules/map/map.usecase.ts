import type { MapNode } from '@memoriar/shared';

export type MapNodesQuery = { cemeteryId: string };

export interface MapRepository {
  getMapNodes(query: MapNodesQuery): Promise<MapNode[]>;
}

export class MapUseCase {
  constructor(private readonly repo: MapRepository) {}

  async getMapNodes(query: MapNodesQuery) {
    return this.repo.getMapNodes(query);
  }
}

