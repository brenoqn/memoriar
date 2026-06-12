import request from 'supertest';
import { describe, expect, it } from 'vitest';

import type { AdminOperationFlowPayload } from '@memoriar/shared';

import { createApp } from '../src/core/http/app';

const token = 'mock-admin-access-token';

const basePayload: AdminOperationFlowPayload = {
  location: {
    mode: 'existing',
    existing_location_id: '3e7c2f22-53c7-4c91-8cda-12b8a3c9a1d8',
    new_location: null
  },
  burial_case: {
    deceased_name: 'Maria Aparecida de Souza',
    public_reference: 'MEM-0001',
    status: 'in_review',
    approx_location_text: null,
    notes: null
  },
  movements: [
    {
      movement_type: 'burial',
      occurred_on: '2020-10-22',
      from_location_code: null,
      to_location_code: 'Q1-JZ-12',
      is_confirmed: true,
      notes: 'Prévia de sepultamento.'
    }
  ]
};

describe('admin operation flow preview (mock)', () => {
  it('returns preview for valid payload', async () => {
    process.env.USE_MOCKS = 'true';
    const app = createApp();
    const res = await request(app)
      .post('/api/admin/operation-flow/preview')
      .set('authorization', `Bearer ${token}`)
      .send(basePayload);

    expect(res.status).toBe(200);
    expect(res.body.preview?.burial_case_summary?.deceased_name).toBe('Maria Aparecida de Souza');
  });

  it('rejects payload without deceased name', async () => {
    process.env.USE_MOCKS = 'true';
    const app = createApp();
    const payload: AdminOperationFlowPayload = {
      ...basePayload,
      burial_case: { ...basePayload.burial_case, deceased_name: '' }
    };
    const res = await request(app)
      .post('/api/admin/operation-flow/preview')
      .set('authorization', `Bearer ${token}`)
      .send(payload);

    expect([400, 422]).toContain(res.status);
  });

  it('rejects payload without movement date', async () => {
    process.env.USE_MOCKS = 'true';
    const app = createApp();
    const payload: AdminOperationFlowPayload = {
      ...basePayload,
      movements: [{ ...basePayload.movements[0]!, occurred_on: '' }]
    };
    const res = await request(app)
      .post('/api/admin/operation-flow/preview')
      .set('authorization', `Bearer ${token}`)
      .send(payload);

    expect([400, 422]).toContain(res.status);
  });

  it('supports multiple movements ordered by date and infers current location from last confirmed', async () => {
    process.env.USE_MOCKS = 'true';
    const app = createApp();
    const payload: AdminOperationFlowPayload = {
      ...basePayload,
      movements: [
        {
          movement_type: 'transfer',
          occurred_on: '2020-12-01',
          from_location_code: 'Q1-JZ-12',
          to_location_code: 'Q2-JZ-03',
          is_confirmed: false,
          notes: 'Pendente de confirmação.'
        },
        {
          movement_type: 'burial',
          occurred_on: '2020-10-22',
          from_location_code: null,
          to_location_code: 'Q1-JZ-12',
          is_confirmed: true,
          notes: null
        },
        {
          movement_type: 'transfer',
          occurred_on: '2021-01-10',
          from_location_code: 'Q2-JZ-03',
          to_location_code: 'Q5-NC-18',
          is_confirmed: true,
          notes: 'Confirmada.'
        }
      ]
    };

    const res = await request(app)
      .post('/api/admin/operation-flow/preview')
      .set('authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.preview.timeline.length).toBe(3);
    expect(res.body.preview.timeline[0].occurred_on).toBe('2020-10-22');
    expect(res.body.preview.timeline[2].occurred_on).toBe('2021-01-10');
    expect(res.body.preview.current_location_inferred.location_code).toBe('Q5-NC-18');
    expect(res.body.preview.timeline[2].is_current_location_inferred).toBe(true);
  });

  it('rejects when movements list is empty', async () => {
    process.env.USE_MOCKS = 'true';
    const app = createApp();
    const payload: AdminOperationFlowPayload = { ...basePayload, movements: [] };
    const res = await request(app)
      .post('/api/admin/operation-flow/preview')
      .set('authorization', `Bearer ${token}`)
      .send(payload);

    expect([400, 422]).toContain(res.status);
  });
});
