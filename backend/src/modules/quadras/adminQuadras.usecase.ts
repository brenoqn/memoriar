import type { AdminQuadraListItem } from '@memoriar/shared';

export type AdminListQuadrasInput = {
  accessToken: string;
};

export interface AdminQuadrasRepository {
  list(input: AdminListQuadrasInput): Promise<AdminQuadraListItem[]>;
}

export class AdminQuadrasUseCase {
  constructor(private readonly repo: AdminQuadrasRepository) {}

  async list(input: AdminListQuadrasInput) {
    return this.repo.list(input);
  }
}

