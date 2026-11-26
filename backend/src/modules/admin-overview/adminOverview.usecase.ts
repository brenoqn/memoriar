import type { AdminOverview } from '@memoriar/shared';

export interface AdminOverviewRepository {
  getOverview(): Promise<AdminOverview>;
}

export class AdminOverviewUseCase {
  constructor(private readonly repo: AdminOverviewRepository) {}

  async getOverview() {
    return this.repo.getOverview();
  }
}

