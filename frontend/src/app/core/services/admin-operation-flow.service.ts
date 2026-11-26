import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import type {
  AdminOperationFlowPayload,
  AdminOperationFlowPreview,
  AdminOperationFlowValidationError
} from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';

type PreviewResponse =
  | { kind: 'ok'; preview: AdminOperationFlowPreview }
  | { kind: 'invalid'; errors: AdminOperationFlowValidationError[]; message: string };

@Injectable({ providedIn: 'root' })
export class AdminOperationFlowService {
  constructor(private readonly http: HttpClient) {}

  preview(payload: AdminOperationFlowPayload) {
    return this.http
      .post<{ preview: AdminOperationFlowPreview }>(
        `${APP_CONFIG.apiBaseUrl}/admin/operation-flow/preview`,
        payload
      )
      .pipe(
        map((r) => ({ kind: 'ok', preview: r.preview }) as const),
        catchError((e: unknown) => {
          const body = (e as { error?: unknown })?.error as
            | { error?: string; message?: string; errors?: AdminOperationFlowValidationError[] }
            | undefined;
          if (body?.error === 'validation_failed' && body.errors) {
            return of({
              kind: 'invalid' as const,
              errors: body.errors,
              message: body.message || 'Corrija os campos para continuar.'
            });
          }
          return throwError(() => e);
        })
      );
  }
}
