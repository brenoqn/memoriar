import { getDummyHash, verifyPassword } from './password.js';
import { signAccessToken } from './token.js';

export type AdminLoginInput = {
  email: string;
  password: string;
};

export type AdminLoginResult =
  | {
      kind: 'ok';
      accessToken: string;
      expiresAt: string;
      userId: string;
      email: string;
      roleKey: string;
    }
  | { kind: 'invalid_credentials' };

export type AdminUserCredentials = {
  id: string;
  email: string;
  passwordHash: string;
  roleKey: string;
  isActive: boolean;
};

export interface AdminAuthRepository {
  findByEmail(email: string): Promise<AdminUserCredentials | null>;
  recordLogin(userId: string): Promise<void>;
}

/** Papéis que podem usar a área administrativa hoje (o viewer ainda não tem telas próprias). */
export const ADMIN_AREA_ROLES = ['admin', 'editor'] as const;

export class AdminAuthUseCase {
  constructor(private readonly repo: AdminAuthRepository) {}

  async login(input: AdminLoginInput): Promise<AdminLoginResult> {
    const user = await this.repo.findByEmail(input.email);
    // Verifica mesmo sem usuário para não revelar, pelo tempo de resposta, quais e-mails existem.
    const passwordOk = await verifyPassword(input.password, user?.passwordHash ?? (await getDummyHash()));

    const allowedRole = (ADMIN_AREA_ROLES as readonly string[]).includes(user?.roleKey ?? '');
    if (!user || !passwordOk || !user.isActive || !allowedRole) {
      return { kind: 'invalid_credentials' };
    }

    await this.repo.recordLogin(user.id);
    const { token, expiresAt } = await signAccessToken({ userId: user.id, roleKey: user.roleKey });
    return {
      kind: 'ok',
      accessToken: token,
      expiresAt,
      userId: user.id,
      email: user.email,
      roleKey: user.roleKey
    };
  }
}
