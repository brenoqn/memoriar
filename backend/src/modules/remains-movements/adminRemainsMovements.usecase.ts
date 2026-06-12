import type { AdminRemainsMovementListItem } from '@memoriar/shared';

export type AdminListRemainsMovementsInput = {
  accessToken: string;
};

export interface AdminRemainsMovementsRepository {
  list(input: AdminListRemainsMovementsInput): Promise<AdminRemainsMovementListItem[]>;
}

export class AdminRemainsMovementsUseCase {
  constructor(private readonly repo: AdminRemainsMovementsRepository) {}

  async list(input: AdminListRemainsMovementsInput) {
    return this.repo.list(input);
  }
}

