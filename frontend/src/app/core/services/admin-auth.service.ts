import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

import { APP_CONFIG } from '../config/app-config';

export type AdminLoginResponse =
  | { kind: 'ok'; accessToken: string; refreshToken: string; userId: string; email: string | null }
  | { kind: 'invalid_body' }
  | { kind: 'invalid_credentials' }
  | { kind: 'supabase_not_configured' };

const STORAGE_KEY = 'memoriar.admin.session.v1';

export type StoredAdminSession = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string | null;
};

function readStoredSession(): StoredAdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAdminSession;
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
    return this.sessionSig()?.accessToken || null;
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
      refreshToken: response.refreshToken,
      userId: response.userId,
      email: response.email
    };
    this.sessionSig.set(session);
    writeStoredSession(session);
  }

  clearSession() {
    this.sessionSig.set(null);
    writeStoredSession(null);
  }
}
