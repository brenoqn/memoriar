import type { PublicDeceasedDetail, PublicDeceasedSearchItem } from '@memoriar/shared';

export type PublicSearchQuery = {
  q: string;
  cemeteryId?: string;
};

export type PublicSearchDetailQuery = {
  burialCaseId: string;
};

export interface PublicSearchRepository {
  search(query: PublicSearchQuery): Promise<PublicDeceasedSearchItem[]>;
  detail(query: PublicSearchDetailQuery): Promise<PublicDeceasedDetail | null>;
}

export class PublicSearchUseCase {
  constructor(private readonly repo: PublicSearchRepository) {}

  async search(query: PublicSearchQuery) {
    return this.repo.search(query);
  }

  async detail(query: PublicSearchDetailQuery) {
    return this.repo.detail(query);
  }
}

