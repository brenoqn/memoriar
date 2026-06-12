import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/core/http/app';

const CEMETERY_ID = 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3';

describe('public map nodes', () => {
  it('returns nodes for a cemetery id (UUID)', async () => {
    process.env.USE_MOCKS = 'true';
    const app = createApp();
    const res = await request(app).get(`/api/public/cemeteries/${CEMETERY_ID}/map-nodes`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.nodes)).toBe(true);
    expect(res.body.nodes.length).toBeGreaterThan(0);
    expect(res.body.nodes[0].cemetery_id).toBe(CEMETERY_ID);
  });

  it('rejects invalid cemetery id', async () => {
    process.env.USE_MOCKS = 'true';
    const app = createApp();
    const res = await request(app).get('/api/public/cemeteries/cem-001/map-nodes');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'invalid_cemetery_id' });
  });
});

