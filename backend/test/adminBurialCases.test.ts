import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/core/http/app';

describe('admin burial cases (mock)', () => {
  it('returns cases', async () => {
    process.env.USE_MOCKS = 'true';
    const app = createApp();
    const res = await request(app)
      .get('/api/admin/burial-cases')
      .set('authorization', 'Bearer mock-admin-access-token');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.cases)).toBe(true);
    expect(res.body.cases.length).toBeGreaterThan(0);
  });
});

