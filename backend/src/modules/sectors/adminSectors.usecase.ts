import type { AdminSectorListItem } from '@memoriar/shared';

export type AdminListSectorsInput = {
  accessToken: string;
};

export interface AdminSectorsRepository {
  list(input: AdminListSectorsInput): Promise<AdminSectorListItem[]>;
}

export class AdminSectorsUseCase {
  constructor(private readonly repo: AdminSectorsRepository) {}

  async list(input: AdminListSectorsInput) {
    return this.repo.list(input);
  }
}

