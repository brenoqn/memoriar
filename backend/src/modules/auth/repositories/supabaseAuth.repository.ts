import { createSupabaseAnonClient } from '../../../integrations/supabase/supabaseClientFactory.js';
import type { AdminAuthRepository, AdminLoginInput, AdminLoginResult } from '../adminAuth.usecase.js';

export class SupabaseAuthRepository implements AdminAuthRepository {
  async login(input: AdminLoginInput): Promise<AdminLoginResult> {
    try {
      const supabase = createSupabaseAnonClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password
      });
      if (error || !data.session) {
        return { kind: 'invalid_credentials' };
      }

      return {
        kind: 'ok',
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        userId: data.user.id,
        email: data.user.email ?? null
      };
    } catch (e) {
      if (String(e) === 'Error: supabase_not_configured') {
        return { kind: 'supabase_not_configured' };
      }
      return { kind: 'invalid_credentials' };
    }
  }
}
