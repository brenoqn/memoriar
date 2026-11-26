import type { AdminSectorListItem } from '@memoriar/shared';

export interface AdminSectorsRepository {
  list(): Promise<AdminSectorListItem[]>;
}

export class AdminSectorsUseCase {
  constructor(private readonly repo: AdminSectorsRepository) {}

  async list() {
    return this.repo.list();
  }
}

