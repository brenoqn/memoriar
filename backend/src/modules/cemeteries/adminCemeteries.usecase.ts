import type { Cemetery } from '@memoriar/shared';

export type AdminListCemeteriesInput = { accessToken: string };

export interface AdminCemeteriesRepository {
  list(input: AdminListCemeteriesInput): Promise<Cemetery[]>;
}

export class AdminCemeteriesUseCase {
  constructor(private readonly repo: AdminCemeteriesRepository) {}

  async list(input: AdminListCemeteriesInput) {
    return this.repo.list(input);
  }
}

