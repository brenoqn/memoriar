import type { AdminAuthRepository, AdminLoginInput, AdminLoginResult } from '../adminAuth.usecase.js';

export class MockAuthRepository implements AdminAuthRepository {
  async login(input: AdminLoginInput): Promise<AdminLoginResult> {
    if (process.env.USE_MOCKS !== 'true') {
      return { kind: 'supabase_not_configured' };
    }

    if (!input.email || !input.password) {
      return { kind: 'invalid_credentials' };
    }

    return {
      kind: 'ok',
      accessToken: 'mock-admin-access-token',
      refreshToken: 'mock-admin-refresh-token',
      userId: '00000000-0000-0000-0000-000000000001',
      email: input.email
    };
  }
}

