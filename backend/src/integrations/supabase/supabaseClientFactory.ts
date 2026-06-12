import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import { env } from '../../core/config/env.js';

export type SupabaseDeps = {
  url: string;
  anonKey: string;
};

function getSupabaseDeps(): SupabaseDeps {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new Error('supabase_not_configured');
  }
  return { url: env.SUPABASE_URL, anonKey: env.SUPABASE_ANON_KEY };
}

export function createSupabaseAnonClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseDeps();
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export function createSupabaseAuthedClient(accessToken: string): SupabaseClient {
  const { url, anonKey } = getSupabaseDeps();
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}
