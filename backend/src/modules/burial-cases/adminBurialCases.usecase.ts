import type { AdminBurialCaseListItem } from '@memoriar/shared';

export interface AdminBurialCasesRepository {
  list(): Promise<AdminBurialCaseListItem[]>;
}

export class AdminBurialCasesUseCase {
  constructor(private readonly repo: AdminBurialCasesRepository) {}

  async list() {
    return this.repo.list();
  }
}

