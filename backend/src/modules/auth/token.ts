import { jwtVerify, SignJWT } from 'jose';

import { env } from '../../core/config/env.js';

const ISSUER = 'memoriar-api';
const AUDIENCE = 'memoriar-admin';
const ALGORITHM = 'HS256';

function secretKey() {
  return new TextEncoder().encode(env.JWT_SECRET);
}

export type AccessTokenClaims = { userId: string; roleKey: string };

export async function signAccessToken(claims: AccessTokenClaims) {
  const expiresInSeconds = env.JWT_EXPIRES_IN_MINUTES * 60;
  const token = await new SignJWT({ role: claims.roleKey })
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(claims.userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${expiresInSeconds}s`)
    .sign(secretKey());
  return { token, expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString() };
}

/** Retorna o id do usuário se o token for válido e não expirado; caso contrário, null. */
export async function verifyAccessToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: [ALGORITHM]
    });
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}
