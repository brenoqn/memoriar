import type { AdminOverview } from '@memoriar/shared';

export type AdminOverviewInput = {
  accessToken: string;
};

export interface AdminOverviewRepository {
  getOverview(input: AdminOverviewInput): Promise<AdminOverview>;
}

export class AdminOverviewUseCase {
  constructor(private readonly repo: AdminOverviewRepository) {}

  async getOverview(input: AdminOverviewInput) {
    return this.repo.getOverview(input);
  }
}

