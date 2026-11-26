import type { AdminQuadraListItem } from '@memoriar/shared';

export interface AdminQuadrasRepository {
  list(): Promise<AdminQuadraListItem[]>;
}

export class AdminQuadrasUseCase {
  constructor(private readonly repo: AdminQuadrasRepository) {}

  async list() {
    return this.repo.list();
  }
}

