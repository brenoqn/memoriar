import type { AdminDataQualityResponse } from '@memoriar/shared';

import type { AdminDataQualityInput, AdminDataQualityRepository } from '../adminDataQuality.usecase.js';

export class NoopAdminDataQualityRepository implements AdminDataQualityRepository {
  async get(_input: AdminDataQualityInput): Promise<AdminDataQualityResponse> {
    return { issues: [], summary: { issues_total: 0, critical: 0, warning: 0, info: 0 } };
  }
}

