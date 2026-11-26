import type { AdminRemainsMovementListItem } from '@memoriar/shared';

export interface AdminRemainsMovementsRepository {
  list(): Promise<AdminRemainsMovementListItem[]>;
}

export class AdminRemainsMovementsUseCase {
  constructor(private readonly repo: AdminRemainsMovementsRepository) {}

  async list() {
    return this.repo.list();
  }
}

