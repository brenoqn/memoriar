import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/core/http/app';

describe('public search', () => {
  it('returns items for a query', async () => {
    process.env.USE_MOCKS = 'true';
    const app = createApp();
    const res = await request(app).get('/api/public/search').query({ q: 'Maria' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });
});

