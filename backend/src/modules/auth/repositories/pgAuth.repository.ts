import type { Queryable } from '../../../db/pool.js';
import type { AdminAuthRepository, AdminUserCredentials } from '../adminAuth.usecase.js';

export class PgAuthRepository implements AdminAuthRepository {
  constructor(private readonly db: Queryable) {}

  async findByEmail(email: string): Promise<AdminUserCredentials | null> {
    const { rows } = await this.db.query<AdminUserCredentials>(
      `select u.id, u.email, u.password_hash as "passwordHash", r.key as "roleKey", u.is_active as "isActive"
         from app_users u
         join app_roles r on r.id = u.role_id
        where lower(u.email) = lower($1)
        limit 1`,
      [email]
    );
    return rows[0] ?? null;
  }

  async recordLogin(userId: string): Promise<void> {
    await this.db.query('update app_users set last_login_at = now() where id = $1', [userId]);
  }
}

/** Usuário ativo e seu papel, usado pelo middleware a cada requisição administrativa. */
export async function findActiveUserRole(db: Queryable, userId: string): Promise<string | null> {
  const { rows } = await db.query<{ role_key: string }>(
    `select r.key as role_key
       from app_users u
       join app_roles r on r.id = u.role_id
      where u.id = $1 and u.is_active = true
      limit 1`,
    [userId]
  );
  return rows[0]?.role_key ?? null;
}
