import type { NextFunction, Request, Response } from 'express';

import {
  createSupabaseAnonClient,
  createSupabaseAuthedClient
} from '../integrations/supabase/supabaseClientFactory.js';

export type AuthedRequest = Request & { accessToken: string; userId: string; roleKey?: string };

export async function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';

  if (!token) {
    res.status(401).json({ error: 'missing_token' });
    return;
  }

  if (process.env.USE_MOCKS === 'true') {
    (req as AuthedRequest).accessToken = token;
    (req as AuthedRequest).userId = '00000000-0000-0000-0000-000000000001';
    next();
    return;
  }

  try {
    const supabase = createSupabaseAnonClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user?.id) {
      res.status(401).json({ error: 'invalid_token' });
      return;
    }

    (req as AuthedRequest).accessToken = token;
    (req as AuthedRequest).userId = data.user.id;

    const supabaseAuthed = createSupabaseAuthedClient(token);
    const { data: roleKey, error: roleError } = await supabaseAuthed.rpc('current_role_key');
    if (roleError || (roleKey !== 'admin' && roleKey !== 'editor')) {
      res.status(403).json({ error: 'forbidden' });
      return;
    }

    (req as AuthedRequest).roleKey = roleKey;
    next();
  } catch {
    res.status(500).json({ error: 'auth_error' });
  }
}
