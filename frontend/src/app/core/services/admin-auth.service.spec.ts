import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AdminAuthService, type StoredAdminSession } from './admin-auth.service';

const STORAGE_KEY = 'memoriar.admin.session.v2';

function session(overrides: Partial<StoredAdminSession> = {}): StoredAdminSession {
  return {
    accessToken: 'token-de-teste',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    userId: '00000000-0000-4000-8000-000000000001',
    email: 'admin@memoriar.local',
    roleKey: 'admin',
    ...overrides
  };
}

function createService() {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()]
  });
  return {
    service: TestBed.inject(AdminAuthService),
    http: TestBed.inject(HttpTestingController)
  };
}

describe('AdminAuthService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('restaura uma sessão válida', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session()));
    const { service } = createService();
    expect(service.isAuthenticated()).toBe(true);
    expect(service.getAccessToken()).toBe('token-de-teste');
  });

  it('descarta sessão expirada', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session({ expiresAt: '2000-01-01T00:00:00.000Z' })));
    const { service } = createService();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('remove a sessão antiga do Supabase', () => {
    localStorage.setItem('memoriar.admin.session.v1', JSON.stringify({ accessToken: 'antigo' }));
    const { service } = createService();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('memoriar.admin.session.v1')).toBeNull();
  });

  it('salva a sessão após login bem-sucedido', () => {
    const { service, http } = createService();
    let ok = false;
    service.login('admin@memoriar.local', 'senha-de-teste-123').subscribe(() => (ok = true));

    const req = http.expectOne('/api/admin/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ kind: 'ok', ...session() });

    expect(ok).toBe(true);
    expect(service.getAccessToken()).toBe('token-de-teste');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').roleKey).toBe('admin');
    http.verify();
  });

  it('não salva sessão quando as credenciais são recusadas', () => {
    const { service, http } = createService();
    let failed = false;
    service.login('admin@memoriar.local', 'senha-errada-123').subscribe({ error: () => (failed = true) });

    http
      .expectOne('/api/admin/auth/login')
      .flush({ kind: 'invalid_credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(failed).toBe(true);
    expect(service.isAuthenticated()).toBe(false);
    http.verify();
  });
});
