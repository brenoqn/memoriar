import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

import { withTransaction } from '../src/db/pool';
import { app, IDS, loginAs } from './helpers';

let token = '';

beforeAll(async () => {
  token = await loginAs('admin');
});

function get(path: string) {
  return request(app).get(path).set('authorization', `Bearer ${token}`);
}

describe('leituras administrativas', () => {
  it('visão geral conta registros por situação', async () => {
    const res = await get('/api/admin/overview');
    expect(res.status).toBe(200);
    expect(res.body.overview).toEqual({
      cemeteries_count: 1,
      burial_locations_count: 4,
      burial_cases_published_count: 3,
      burial_cases_in_review_count: 1,
      burial_cases_not_found_precisely_count: 1
    });
  });

  it('lista cemitérios identificando os dados demonstrativos', async () => {
    const res = await get('/api/admin/cemeteries');
    expect(res.status).toBe(200);
    expect(res.body.cemeteries).toHaveLength(1);
    expect(res.body.cemeteries[0].name).toContain('(demonstração)');
    expect(typeof res.body.cemeteries[0].created_at).toBe('string');
  });

  it('lista setores e quadras com nomes relacionados', async () => {
    const sectors = await get('/api/admin/sectors');
    expect(sectors.status).toBe(200);
    expect(sectors.body.sectors.map((s: { code: string }) => s.code)).toEqual(['S1', 'S2']);
    expect(sectors.body.sectors[0].cemetery_name).toContain('Cemitério Municipal Central');

    const quadras = await get('/api/admin/quadras');
    expect(quadras.status).toBe(200);
    expect(quadras.body.quadras).toHaveLength(3);
    expect(quadras.body.quadras[0]).toMatchObject({ code: 'Q1', sector_code: 'S1', cemetery_id: IDS.cemetery });
  });

  it('lista locais com tipo, setor e quadra', async () => {
    const res = await get('/api/admin/burial-locations');
    expect(res.status).toBe(200);
    expect(res.body.locations).toHaveLength(4);
    const jazigo = res.body.locations.find((l: { code: string }) => l.code === 'Q1-JZ-12');
    expect(jazigo).toMatchObject({
      sector_code: 'S1',
      quadra_code: 'Q1',
      type_code: 'JZ',
      kind: 'vault',
      default_capacity: 4,
      allows_multiple: true
    });
  });

  it('lista casos com local atual pela última movimentação confirmada', async () => {
    const res = await get('/api/admin/burial-cases');
    expect(res.status).toBe(200);
    expect(res.body.cases).toHaveLength(5);
    const ana = res.body.cases.find((c: { burial_case_id: string }) => c.burial_case_id === IDS.caseAna);
    expect(ana).toMatchObject({ location_code: 'Q2-GV-04', sector_code: 'S1', quadra_code: 'Q2' });
  });

  it('lista movimentações com códigos de origem e destino', async () => {
    const res = await get('/api/admin/remains-movements');
    expect(res.status).toBe(200);
    expect(res.body.movements).toHaveLength(5);
    const transfer = res.body.movements.find((m: { movement_type: string }) => m.movement_type === 'transfer');
    expect(transfer).toMatchObject({
      from_location_code: 'Q1-JZ-18',
      to_location_code: 'Q2-GV-04',
      deceased_name: 'Ana Clara Martins',
      occurred_on: '2021-05-18'
    });
  });

  it('aponta pendências de qualidade de dados', async () => {
    const res = await get('/api/admin/data-quality');
    expect(res.status).toBe(200);
    expect(res.body.summary).toEqual({ issues_total: 3, critical: 0, warning: 2, info: 1 });
    expect(res.body.issues.map((i: { type: string }) => i.type).sort()).toEqual([
      'case_in_review',
      'case_without_precise_location',
      'legacy_record_pending_validation'
    ]);
  });
});

describe('auditoria', () => {
  it('registra o usuário da transação no audit_log', async () => {
    const actor = await withTransaction(async (client) => {
      const { rows } = await client.query<{ id: string }>("select id from app_users where email like 'admin.%'");
      return rows[0].id;
    });

    await withTransaction(
      async (client) => {
        await client.query("update cemeteries set address = address where id = $1", [IDS.cemetery]);
      },
      { actorUserId: actor }
    );

    const { rows } = await withTransaction((client) =>
      client.query<{ actor_user_id: string; action: string }>(
        `select actor_user_id, action from audit_log
          where table_name = 'cemeteries' and record_id = $1
          order by id desc limit 1`,
        [IDS.cemetery]
      )
    );
    expect(rows[0]).toEqual({ actor_user_id: actor, action: 'UPDATE' });
  });
});
