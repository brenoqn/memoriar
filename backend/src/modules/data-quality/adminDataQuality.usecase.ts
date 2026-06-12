import type { AdminDataQualityResponse } from '@memoriar/shared';

export type AdminDataQualityInput = {
  accessToken: string;
};

export interface AdminDataQualityRepository {
  get(input: AdminDataQualityInput): Promise<AdminDataQualityResponse>;
}

export class AdminDataQualityUseCase {
  constructor(private readonly repo: AdminDataQualityRepository) {}

  async get(input: AdminDataQualityInput) {
    return this.repo.get(input);
  }
}

