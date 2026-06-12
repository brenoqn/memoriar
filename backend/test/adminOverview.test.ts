import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/core/http/app';

describe('admin overview (mock)', () => {
  it('returns overview', async () => {
    process.env.USE_MOCKS = 'true';
    const app = createApp();
    const res = await request(app)
      .get('/api/admin/overview')
      .set('authorization', 'Bearer mock-admin-access-token');
    expect(res.status).toBe(200);
    expect(res.body.overview?.cemeteries_count).toBeGreaterThan(0);
  });
});

