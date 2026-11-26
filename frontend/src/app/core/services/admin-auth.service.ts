import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

import { APP_CONFIG } from '../config/app-config';

export type AdminLoginResponse =
  | {
      kind: 'ok';
      accessToken: string;
      expiresAt: string;
      userId: string;
      email: string;
      roleKey: string;
    }
  | { kind: 'invalid_body' }
  | { kind: 'invalid_credentials' };

// v2: sessões da autenticação própria (as v1 eram tokens do Supabase e não valem mais).
const STORAGE_KEY = 'memoriar.admin.session.v2';
const LEGACY_STORAGE_KEY = 'memoriar.admin.session.v1';

export type StoredAdminSession = {
  accessToken: string;
  expiresAt: string;
  userId: string;
  email: string;
  roleKey: string;
};

function isExpired(session: StoredAdminSession) {
  const expiresAt = Date.parse(session.expiresAt);
  return !Number.isFinite(expiresAt) || expiresAt <= Date.now();
}

function readStoredSession(): StoredAdminSession | null {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as StoredAdminSession;
    if (!session?.accessToken || isExpired(session)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function writeStoredSession(session: StoredAdminSession | null) {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly sessionSig = signal<StoredAdminSession | null>(readStoredSession());

  constructor(private readonly http: HttpClient) {}

  isAuthenticated() {
    return !!this.getAccessToken();
  }

  getAccessToken() {
    const session = this.sessionSig();
    if (!session) return null;
    if (isExpired(session)) {
      this.clearSession();
      return null;
    }
    return session.accessToken;
  }

  login(email: string, password: string) {
    return this.http
      .post<AdminLoginResponse>(`${APP_CONFIG.apiBaseUrl}/admin/auth/login`, { email, password })
      .pipe(
        tap((res) => this.saveSession(res)),
        map((res) => {
          if (res.kind !== 'ok') {
            throw new Error(`Login administrativo falhou: ${res.kind}`);
          }
          return res;
        }),
        catchError((err: unknown) => {
          if (err instanceof HttpErrorResponse) return throwError(() => err);
          return throwError(() => err);
        })
      );
  }

  logout() {
    this.clearSession();
  }

  saveSession(response: AdminLoginResponse) {
    if (response.kind !== 'ok') return;
    const session: StoredAdminSession = {
      accessToken: response.accessToken,
      expiresAt: response.expiresAt,
      userId: response.userId,
      email: response.email,
      roleKey: response.roleKey
    };
    this.sessionSig.set(session);
    writeStoredSession(session);
  }

  clearSession() {
    this.sessionSig.set(null);
    writeStoredSession(null);
  }
}
