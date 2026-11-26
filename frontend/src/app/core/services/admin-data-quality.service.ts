import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { AdminDataQualityResponse } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';

@Injectable({ providedIn: 'root' })
export class AdminDataQualityService {
  constructor(private readonly http: HttpClient) {}

  get() {
    return this.http.get<AdminDataQualityResponse>(`${APP_CONFIG.apiBaseUrl}/admin/data-quality`);
  }
}
