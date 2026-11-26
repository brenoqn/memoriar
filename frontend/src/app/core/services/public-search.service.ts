import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, type Observable } from 'rxjs';
import type { PublicDeceasedDetail, PublicDeceasedSearchItem } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';

@Injectable({ providedIn: 'root' })
export class PublicSearchService {
  constructor(private readonly http: HttpClient) {}

  search(q: string, cemeteryId?: string): Observable<PublicDeceasedSearchItem[]> {
    return this.http
      .get<{ items: PublicDeceasedSearchItem[] } | PublicDeceasedSearchItem[]>(
        `${APP_CONFIG.apiBaseUrl}/public/search`,
        {
        params: cemeteryId ? { q, cemeteryId } : { q }
        }
      )
      .pipe(
        map((r) => {
          if (Array.isArray(r)) return r;
          if (r && Array.isArray(r.items)) return r.items;
          throw new Error('Resposta inesperada na busca pública.');
        })
      );
  }

  getCaseDetail(burialCaseId: string): Observable<PublicDeceasedDetail | null> {
    return this.http
      .get<{ item: PublicDeceasedDetail } | PublicDeceasedDetail>(
        `${APP_CONFIG.apiBaseUrl}/public/cases/${burialCaseId}`
      )
      .pipe(
        map((r) => {
          if (r && typeof r === 'object' && 'item' in r) {
            const item = (r as { item?: PublicDeceasedDetail }).item;
            return item || null;
          }
          if (r && typeof r === 'object') return r as PublicDeceasedDetail;
          throw new Error('Resposta inesperada no detalhe público.');
        })
      );
  }

  detail(burialCaseId: string) {
    return this.getCaseDetail(burialCaseId);
  }
}
