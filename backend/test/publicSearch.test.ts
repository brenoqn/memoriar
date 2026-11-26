import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { getPool } from '../src/db/pool';
import { app, IDS } from './helpers';

describe('busca pública', () => {
  it('encontra pelo nome, sem diferenciar maiúsculas', async () => {
    const res = await request(app).get('/api/public/search').query({ q: 'maria' });
    expect(res.status).toBe(200);
    expect(res.body.items.map((i: { deceased_name: string }) => i.deceased_name)).toEqual([
      'Maria Aparecida de Souza'
    ]);
  });

  it('encontra pela referência pública', async () => {
    const res = await request(app).get('/api/public/search').query({ q: 'MEM-0001' });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].burial_case_id).toBe(IDS.caseMaria);
  });

  it('encontra pelo código do local', async () => {
    const res = await request(app).get('/api/public/search').query({ q: 'q2-gv-04' });
    expect(res.status).toBe(200);
    expect(res.body.items.map((i: { public_reference: string }) => i.public_reference)).toEqual(['MEM-0003']);
  });

  it('inclui casos com localização não confirmada, sem expor local', async () => {
    const res = await request(app).get('/api/public/search').query({ q: 'José Carlos' });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    const item = res.body.items[0];
    expect(item.status).toBe('not_found_precisely');
    expect(item.location_code).toBeNull();
    expect(item.map_node_id).toBeNull();
    expect(item.approx_location_text).toContain('Localização exata pendente');
  });

  it('não expõe casos em revisão', async () => {
    const res = await request(app).get('/api/public/search').query({ q: 'Pedro Henrique' });
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
  });

  it('trata curingas do LIKE como texto', async () => {
    const res = await request(app).get('/api/public/search').query({ q: '%' });
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
  });

  it('filtra por cemitério', async () => {
    const other = '00000000-0000-4000-8000-000000000000';
    const res = await request(app).get('/api/public/search').query({ q: 'Maria', cemeteryId: other });
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
  });

  it('rejeita busca vazia', async () => {
    const res = await request(app).get('/api/public/search').query({ q: '  ' });
    expect(res.status).toBe(400);
  });

  it('responde 500 quando o banco falha, em vez de lista vazia', async () => {
    const pool = getPool();
    await pool.query('alter view v_public_deceased_search rename to v_public_deceased_search_tmp');
    try {
      const res = await request(app).get('/api/public/search').query({ q: 'Maria' });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('internal_error');
    } finally {
      await pool.query('alter view v_public_deceased_search_tmp rename to v_public_deceased_search');
    }
  });
});

describe('detalhe público', () => {
  it('retorna local, instruções e última movimentação de caso publicado', async () => {
    const res = await request(app).get(`/api/public/cases/${IDS.caseMaria}`);
    expect(res.status).toBe(200);
    expect(res.body.item).toMatchObject({
      burial_case_id: IDS.caseMaria,
      deceased_name: 'Maria Aparecida de Souza',
      birth_date: '1948-04-09',
      location_code: 'Q1-JZ-12',
      sector_code: 'S1',
      quadra_code: 'Q1',
      last_movement_type: 'interment',
      last_occurred_on: '2020-10-22'
    });
    expect(res.body.item.location_text).toContain('Jazigo 12');
  });

  it('usa a última movimentação confirmada como local atual', async () => {
    const res = await request(app).get(`/api/public/cases/${IDS.caseAna}`);
    expect(res.status).toBe(200);
    expect(res.body.item.location_code).toBe('Q2-GV-04');
    expect(res.body.item.last_movement_type).toBe('transfer');
  });

  it('caso não confirmado não traz local nem movimentação', async () => {
    const res = await request(app).get(`/api/public/cases/${IDS.caseJoseNotFound}`);
    expect(res.status).toBe(200);
    expect(res.body.item.status).toBe('not_found_precisely');
    expect(res.body.item.current_location_id).toBeNull();
    expect(res.body.item.last_movement_type).toBeNull();
  });

  it('retorna 404 para caso inexistente', async () => {
    const res = await request(app).get('/api/public/cases/00000000-0000-4000-8000-000000000000');
    expect(res.status).toBe(404);
  });
});

describe('mapa público', () => {
  it('retorna os nós publicados do cemitério', async () => {
    const res = await request(app).get(`/api/public/cemeteries/${IDS.cemetery}/map-nodes`);
    expect(res.status).toBe(200);
    expect(res.body.nodes).toHaveLength(4);
    expect(res.body.nodes[0].cemetery_id).toBe(IDS.cemetery);
  });

  it('rejeita id inválido', async () => {
    const res = await request(app).get('/api/public/cemeteries/cem-001/map-nodes');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'invalid_cemetery_id' });
  });
});

describe('health', () => {
  it('confirma conectividade com o banco', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, database: 'ok' });
  });
});
