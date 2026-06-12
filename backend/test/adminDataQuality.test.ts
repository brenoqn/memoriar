import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/core/http/app';

describe('admin data quality (mock)', () => {
  it('returns issues and summary', async () => {
    process.env.USE_MOCKS = 'true';
    const app = createApp();
    const res = await request(app)
      .get('/api/admin/data-quality')
      .set('authorization', 'Bearer mock-admin-access-token');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.issues)).toBe(true);
    expect(res.body.summary?.issues_total).toBeGreaterThan(0);
  });
});

