import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

import type { AdminOperationFlowPayload } from '@memoriar/shared';

import { app, IDS, loginAs } from './helpers';

let token = '';

beforeAll(async () => {
  token = await loginAs('admin');
});

const basePayload: AdminOperationFlowPayload = {
  location: {
    mode: 'existing',
    existing_location_id: IDS.locationQ1JZ12,
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

describe('admin operation flow preview', () => {
  it('returns preview for valid payload', async () => {
    const res = await request(app)
      .post('/api/admin/operation-flow/preview')
      .set('authorization', `Bearer ${token}`)
      .send(basePayload);

    expect(res.status).toBe(200);
    expect(res.body.preview?.burial_case_summary?.deceased_name).toBe('Maria Aparecida de Souza');
    expect(res.body.preview.location_summary).toEqual({
      mode: 'existing',
      location_code: 'Q1-JZ-12',
      sector_code: 'S1',
      quadra_code: 'Q1',
      map_node_id: '3b8dbd69-e31a-4d29-9256-4c5c0d9e9b51'
    });
  });

  it('rejects an existing location that is not registered', async () => {
    const payload: AdminOperationFlowPayload = {
      ...basePayload,
      location: { ...basePayload.location, existing_location_id: '00000000-0000-4000-8000-000000000000' }
    };
    const res = await request(app)
      .post('/api/admin/operation-flow/preview')
      .set('authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.status).toBe(422);
    expect(res.body.errors[0].code).toBe('location_not_found');
  });

  it('rejects payload without deceased name', async () => {
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
    const payload: AdminOperationFlowPayload = { ...basePayload, movements: [] };
    const res = await request(app)
      .post('/api/admin/operation-flow/preview')
      .set('authorization', `Bearer ${token}`)
      .send(payload);

    expect([400, 422]).toContain(res.status);
  });
});
