import type { AdminBurialLocationListItem } from '@memoriar/shared';

export type AdminListBurialLocationsInput = {
  accessToken: string;
};

export interface AdminBurialLocationsRepository {
  list(input: AdminListBurialLocationsInput): Promise<AdminBurialLocationListItem[]>;
}

export class AdminBurialLocationsUseCase {
  constructor(private readonly repo: AdminBurialLocationsRepository) {}

  async list(input: AdminListBurialLocationsInput) {
    return this.repo.list(input);
  }
}

