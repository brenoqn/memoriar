import request from 'supertest';

import { createApp } from '../src/core/http/app';
import { TEST_USERS } from './testDatabase';

export const app = createApp();

export async function loginAs(user: keyof typeof TEST_USERS = 'admin'): Promise<string> {
  const { email, password } = TEST_USERS[user];
  const res = await request(app).post('/api/admin/auth/login').send({ email, password });
  if (res.status !== 200) throw new Error(`login de teste falhou: ${res.status}`);
  return res.body.accessToken as string;
}

export const IDS = {
  cemetery: 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
  caseMaria: '1a3b5c0d-2a54-4b62-9ae7-1b61b4f5b9aa',
  caseAna: '9d2d4a65-6e1e-4c0c-88d6-67c0e4d09021',
  caseJoseNotFound: '5f3b8f5e-9e09-46b4-8bb9-6dc2a2e043a1',
  locationQ1JZ12: '3e7c2f22-53c7-4c91-8cda-12b8a3c9a1d8'
} as const;
