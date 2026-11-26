import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, type Observable } from 'rxjs';
import type { MapNode } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';

@Injectable({ providedIn: 'root' })
export class MapService {
  constructor(private readonly http: HttpClient) {}

  getMapNodes(cemeteryId: string): Observable<MapNode[]> {
    return this.http
      .get<{ nodes: MapNode[] } | MapNode[]>(
        `${APP_CONFIG.apiBaseUrl}/public/cemeteries/${cemeteryId}/map-nodes`
      )
      .pipe(
        map((r) => {
          if (Array.isArray(r)) return r;
          if (r && Array.isArray(r.nodes)) return r.nodes;
          throw new Error('Resposta inesperada no mapa público.');
        })
      );
  }
}
