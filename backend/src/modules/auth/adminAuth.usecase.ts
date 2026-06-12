export type AdminLoginInput = {
  email: string;
  password: string;
};

export type AdminLoginResult =
  | { kind: 'ok'; accessToken: string; refreshToken: string; userId: string; email: string | null }
  | { kind: 'invalid_credentials' }
  | { kind: 'supabase_not_configured' };

export interface AdminAuthRepository {
  login(input: AdminLoginInput): Promise<AdminLoginResult>;
}

export class AdminAuthUseCase {
  constructor(private readonly repo: AdminAuthRepository) {}

  async login(input: AdminLoginInput) {
    return this.repo.login(input);
  }
}

