import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { getPool } from '../src/db/pool';
import { hashPassword, verifyPassword } from '../src/modules/auth/password';
import { app, loginAs } from './helpers';
import { TEST_USERS } from './testDatabase';

describe('senhas', () => {
  it('gera hash verificável e diferente a cada chamada', async () => {
    const a = await hashPassword('uma-senha-qualquer');
    const b = await hashPassword('uma-senha-qualquer');
    expect(a).not.toBe(b);
    expect(a.startsWith('scrypt$')).toBe(true);
    expect(await verifyPassword('uma-senha-qualquer', a)).toBe(true);
    expect(await verifyPassword('outra-senha', a)).toBe(false);
    expect(await verifyPassword('uma-senha-qualquer', 'formato-invalido')).toBe(false);
  });
});

describe('login administrativo', () => {
  it('autentica admin e editor com e-mail sem diferenciar maiúsculas', async () => {
    for (const key of ['admin', 'editor'] as const) {
      const user = TEST_USERS[key];
      const res = await request(app)
        .post('/api/admin/auth/login')
        .send({ email: user.email.toUpperCase(), password: user.password });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ kind: 'ok', email: user.email, roleKey: key });
      expect(typeof res.body.accessToken).toBe('string');
      expect(Date.parse(res.body.expiresAt)).toBeGreaterThan(Date.now());
      expect(res.body).not.toHaveProperty('refreshToken');
    }
  });

  it('recusa senha errada, e-mail inexistente, viewer e usuário inativo com a mesma resposta', async () => {
    const attempts = [
      { email: TEST_USERS.admin.email, password: 'senha-errada-123' },
      { email: 'ninguem@memoriar.local', password: 'qualquer-senha-123' },
      { email: TEST_USERS.viewer.email, password: TEST_USERS.viewer.password },
      { email: TEST_USERS.inactive.email, password: TEST_USERS.inactive.password }
    ];
    for (const body of attempts) {
      const res = await request(app).post('/api/admin/auth/login').send(body);
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ kind: 'invalid_credentials', error: 'invalid_credentials' });
    }
  });

  it('valida o corpo da requisição', async () => {
    const res = await request(app).post('/api/admin/auth/login').send({ email: 'x', password: '1' });
    expect(res.status).toBe(400);
  });
});

describe('proteção das rotas administrativas', () => {
  it('exige token', async () => {
    const res = await request(app).get('/api/admin/overview');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'missing_token' });
  });

  it('recusa token inválido', async () => {
    const res = await request(app).get('/api/admin/overview').set('authorization', 'Bearer abc.def.ghi');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'invalid_token' });
  });

  it('bloqueia imediatamente usuário desativado depois do login', async () => {
    const token = await loginAs('editor');
    const pool = getPool();
    await pool.query('update app_users set is_active = false where email = $1', [TEST_USERS.editor.email]);
    try {
      const res = await request(app).get('/api/admin/overview').set('authorization', `Bearer ${token}`);
      expect(res.status).toBe(403);
      expect(res.body).toEqual({ error: 'forbidden' });
    } finally {
      await pool.query('update app_users set is_active = true where email = $1', [TEST_USERS.editor.email]);
    }
  });
});
