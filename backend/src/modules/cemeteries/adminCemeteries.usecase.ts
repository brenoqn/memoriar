import type { Cemetery } from '@memoriar/shared';

export interface AdminCemeteriesRepository {
  list(): Promise<Cemetery[]>;
}

export class AdminCemeteriesUseCase {
  constructor(private readonly repo: AdminCemeteriesRepository) {}

  async list() {
    return this.repo.list();
  }
}

