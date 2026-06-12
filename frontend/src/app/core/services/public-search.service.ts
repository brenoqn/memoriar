import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, throwError, type Observable } from 'rxjs';
import type { PublicDeceasedDetail, PublicDeceasedSearchItem } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';
import { mockPublicDetail, mockPublicSearch } from '../../mocks/public.mock';

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
        }),
        catchError((err) => {
          if (!APP_CONFIG.allowMockFallback) return throwError(() => err);
          return of(mockPublicSearch(q, cemeteryId));
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
        }),
        catchError((err) => {
          if (!APP_CONFIG.allowMockFallback) return throwError(() => err);
          return of(mockPublicDetail(burialCaseId));
        })
      );
  }

  detail(burialCaseId: string) {
    return this.getCaseDetail(burialCaseId);
  }
}
