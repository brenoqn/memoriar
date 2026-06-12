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

function mockPreview(payload: AdminOperationFlowPayload): PreviewResponse {
  const errors: AdminOperationFlowValidationError[] = [];
  if (!payload.burial_case.deceased_name.trim()) {
    errors.push({ code: 'deceased_name_required', message: 'Informe o nome do falecido.', field: 'burial_case.deceased_name' });
  }
  if (!payload.movements.length) {
    errors.push({ code: 'movement_required', message: 'Adicione pelo menos uma movimentação ao histórico.', field: 'movements' });
  }
  if (errors.length) return { kind: 'invalid', errors, message: 'Corrija os campos para continuar.' };

  const ordered = [...payload.movements].sort((a, b) => {
    const da = new Date(a.occurred_on).getTime();
    const db = new Date(b.occurred_on).getTime();
    if (Number.isNaN(da) && Number.isNaN(db)) return 0;
    if (Number.isNaN(da)) return 1;
    if (Number.isNaN(db)) return -1;
    return da - db;
  });

  const lastConfirmed = [...ordered].reverse().find((m) => m.is_confirmed) || null;
  const currentLocationCode =
    lastConfirmed?.movement_type === 'exhumation' ? null : lastConfirmed?.to_location_code || null;

  return {
    kind: 'ok',
    preview: {
      location_summary: {
        mode: payload.location.mode,
        location_code:
          payload.location.mode === 'new' ? payload.location.new_location?.code || null : null,
        sector_code: null,
        quadra_code: null,
        map_node_id:
          payload.location.mode === 'new' ? payload.location.new_location?.map_node_id || null : null
      },
      burial_case_summary: {
        deceased_name: payload.burial_case.deceased_name.trim(),
        public_reference: payload.burial_case.public_reference,
        status: payload.burial_case.status,
        approx_location_text: payload.burial_case.approx_location_text
      },
      timeline: ordered.map((m, idx) => ({
        ...m,
        order_index: idx,
        is_current_location_inferred: !!lastConfirmed && m === lastConfirmed
      })),
      current_location_inferred: {
        location_code: lastConfirmed ? currentLocationCode : null,
        as_of_occurred_on: lastConfirmed?.occurred_on || null
      },
      warnings: ['Prévia gerada localmente (fallback mock).']
    }
  };
}

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
          if (!APP_CONFIG.allowMockFallback) return throwError(() => e);
          return of(mockPreview(payload));
        })
      );
  }
}
