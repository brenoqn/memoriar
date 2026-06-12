import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/core/http/app';

const BURIAL_CASE_ID = '1a3b5c0d-2a54-4b62-9ae7-1b61b4f5b9aa';

describe('public case detail', () => {
  it('returns detail for a published burial case (mock)', async () => {
    process.env.USE_MOCKS = 'true';
    const app = createApp();
    const res = await request(app).get(`/api/public/cases/${BURIAL_CASE_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.item?.burial_case_id).toBe(BURIAL_CASE_ID);
    expect(res.body.item?.deceased_name).toBeTruthy();
  });
});
