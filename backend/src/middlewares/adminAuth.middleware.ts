import type { NextFunction, Request, Response } from 'express';

import { getPool } from '../db/pool.js';
import { ADMIN_AREA_ROLES } from '../modules/auth/adminAuth.usecase.js';
import { findActiveUserRole } from '../modules/auth/repositories/pgAuth.repository.js';
import { verifyAccessToken } from '../modules/auth/token.js';

export type AuthedRequest = Request & { userId: string; roleKey: string };

export async function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : '';

  if (!token) {
    res.status(401).json({ error: 'missing_token' });
    return;
  }

  const userId = await verifyAccessToken(token);
  if (!userId) {
    res.status(401).json({ error: 'invalid_token' });
    return;
  }

  try {
    // O papel é lido do banco a cada requisição: desativar um usuário tem efeito imediato.
    const roleKey = await findActiveUserRole(getPool(), userId);
    if (!roleKey || !(ADMIN_AREA_ROLES as readonly string[]).includes(roleKey)) {
      res.status(403).json({ error: 'forbidden' });
      return;
    }

    (req as AuthedRequest).userId = userId;
    (req as AuthedRequest).roleKey = roleKey;
    next();
  } catch (err) {
    next(err);
  }
}
