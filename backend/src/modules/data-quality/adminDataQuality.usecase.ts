import type { AdminDataQualityResponse } from '@memoriar/shared';

export interface AdminDataQualityRepository {
  get(): Promise<AdminDataQualityResponse>;
}

export class AdminDataQualityUseCase {
  constructor(private readonly repo: AdminDataQualityRepository) {}

  async get() {
    return this.repo.get();
  }
}

