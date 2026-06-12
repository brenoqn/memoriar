import type { Cemetery } from '@memoriar/shared';

import type { AdminCemeteriesRepository, AdminListCemeteriesInput } from '../adminCemeteries.usecase.js';

export class MockAdminCemeteriesRepository implements AdminCemeteriesRepository {
  async list(_input: AdminListCemeteriesInput): Promise<Cemetery[]> {
    const now = new Date().toISOString();
    return [
      {
        id: 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
        name: 'Cemitério Municipal Central',
        address: 'Av. Principal, 1000',
        status: 'published',
        logical_map_note: 'Mapa lógico ilustrativo do Setor 1 e referências principais.',
        created_at: now,
        updated_at: now
      }
    ];
  }
}
