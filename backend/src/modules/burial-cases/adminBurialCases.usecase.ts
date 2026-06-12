import type { AdminBurialCaseListItem } from '@memoriar/shared';

export type AdminListBurialCasesInput = {
  accessToken: string;
};

export interface AdminBurialCasesRepository {
  list(input: AdminListBurialCasesInput): Promise<AdminBurialCaseListItem[]>;
}

export class AdminBurialCasesUseCase {
  constructor(private readonly repo: AdminBurialCasesRepository) {}

  async list(input: AdminListBurialCasesInput) {
    return this.repo.list(input);
  }
}

