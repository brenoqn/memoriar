import type { AdminBurialLocationListItem } from '@memoriar/shared';

export interface AdminBurialLocationsRepository {
  list(): Promise<AdminBurialLocationListItem[]>;
}

export class AdminBurialLocationsUseCase {
  constructor(private readonly repo: AdminBurialLocationsRepository) {}

  async list() {
    return this.repo.list();
  }
}

