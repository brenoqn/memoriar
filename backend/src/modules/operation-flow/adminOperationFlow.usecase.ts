import type {
  AdminOperationFlowPayload,
  AdminOperationFlowPreview,
  AdminOperationFlowValidationError
} from '@memoriar/shared';

export type AdminOperationFlowPreviewResult =
  | { kind: 'ok'; preview: AdminOperationFlowPreview }
  | { kind: 'invalid'; errors: AdminOperationFlowValidationError[] };

export type OperationFlowLocationSummary = {
  code: string;
  sector_code: string | null;
  quadra_code: string | null;
  map_node_id: string | null;
};

export interface AdminOperationFlowRepository {
  findLocationSummary(locationId: string): Promise<OperationFlowLocationSummary | null>;
}

export class AdminOperationFlowUseCase {
  constructor(private readonly repo: AdminOperationFlowRepository) {}

  async preview(payload: AdminOperationFlowPayload): Promise<AdminOperationFlowPreviewResult> {
    const errors: AdminOperationFlowValidationError[] = [];

    const hasLocation =
      payload.location.mode === 'existing'
        ? !!payload.location.existing_location_id
        : payload.location.mode === 'new'
          ? !!payload.location.new_location?.code
          : payload.location.mode === 'not_confirmed';

    if (!hasLocation) {
      errors.push({
        code: 'location_required',
        message: 'Selecione um local físico ou marque como localização não confirmada.',
        field: 'location'
      });
    }

    const name = payload.burial_case.deceased_name.trim();
    if (!name) {
      errors.push({
        code: 'deceased_name_required',
        message: 'Informe o nome do falecido.',
        field: 'burial_case.deceased_name'
      });
    }

    if (payload.burial_case.status === 'not_found_precisely') {
      const hasJustification =
        !!payload.burial_case.approx_location_text?.trim() || !!payload.burial_case.notes?.trim();
      if (!hasJustification) {
        errors.push({
          code: 'approx_or_notes_required',
          message:
            'Para “localização não confirmada”, informe um texto de localização aproximada ou uma observação.',
          field: 'burial_case.approx_location_text'
        });
      }
    }

    if (!payload.movements.length) {
      errors.push({
        code: 'movement_required',
        message: 'Adicione pelo menos uma movimentação ao histórico.',
        field: 'movements'
      });
    }

    payload.movements.forEach((m, idx) => {
      const prefix = `movements[${idx}]`;

      if (!m.movement_type) {
        errors.push({
          code: 'movement_type_required',
          message: 'Selecione o tipo de movimentação.',
          field: `${prefix}.movement_type`
        });
      }

      if (!m.occurred_on || !m.occurred_on.trim()) {
        errors.push({
          code: 'movement_date_required',
          message: 'Informe a data da movimentação.',
          field: `${prefix}.occurred_on`
        });
      }

      const needsFrom = m.movement_type !== 'burial';
      const needsTo = m.movement_type !== 'exhumation';

      if (needsFrom && !m.from_location_code?.trim()) {
        errors.push({
          code: 'movement_from_required',
          message: 'Informe a origem da movimentação.',
          field: `${prefix}.from_location_code`
        });
      }

      if (needsTo && !m.to_location_code?.trim()) {
        errors.push({
          code: 'movement_to_required',
          message: 'Informe o destino da movimentação.',
          field: `${prefix}.to_location_code`
        });
      }
    });

    if (errors.length) return { kind: 'invalid', errors };

    const warnings: string[] = [];
    const pendingCount = payload.movements.filter((m) => !m.is_confirmed).length;
    if (pendingCount) {
      warnings.push(
        pendingCount === 1
          ? '1 movimentação está pendente de confirmação.'
          : `${pendingCount} movimentações estão pendentes de confirmação.`
      );
    }

    let location_code: string | null = null;
    let sector_code: string | null = null;
    let quadra_code: string | null = null;
    let map_node_id: string | null = null;

    if (payload.location.mode === 'existing' && payload.location.existing_location_id) {
      const loc = await this.repo.findLocationSummary(payload.location.existing_location_id);
      if (!loc) {
        return {
          kind: 'invalid',
          errors: [
            {
              code: 'location_not_found',
              message: 'O local selecionado não foi encontrado no cadastro.',
              field: 'location.existing_location_id'
            }
          ]
        };
      }
      location_code = loc.code;
      sector_code = loc.sector_code;
      quadra_code = loc.quadra_code;
      map_node_id = loc.map_node_id;
    }

    if (payload.location.mode === 'new' && payload.location.new_location) {
      location_code = payload.location.new_location.code;
      map_node_id = payload.location.new_location.map_node_id;
    }

    if (payload.location.mode === 'not_confirmed') {
      warnings.push('O caso será registrado sem localização confirmada.');
    }

    const ordered = [...payload.movements].sort((a, b) => {
      const da = new Date(a.occurred_on).getTime();
      const db = new Date(b.occurred_on).getTime();
      if (Number.isNaN(da) && Number.isNaN(db)) return 0;
      if (Number.isNaN(da)) return 1;
      if (Number.isNaN(db)) return -1;
      return da - db;
    });

    const hadReorder = ordered.some((m, i) => m !== payload.movements[i]);
    if (hadReorder) {
      warnings.push('Histórico reordenado por data para exibição cronológica.');
    }

    const lastConfirmed =
      [...ordered].reverse().find((m) => m.is_confirmed && !!m.occurred_on?.trim()) || null;

    const currentLocationCode =
      lastConfirmed?.movement_type === 'exhumation'
        ? null
        : lastConfirmed?.to_location_code || null;

    const timeline = ordered.map((m, idx) => ({
      ...m,
      order_index: idx,
      is_current_location_inferred: !!lastConfirmed && m === lastConfirmed
    }));

    return {
      kind: 'ok',
      preview: {
        location_summary: {
          mode: payload.location.mode,
          location_code,
          sector_code,
          quadra_code,
          map_node_id
        },
        burial_case_summary: {
          deceased_name: payload.burial_case.deceased_name.trim(),
          public_reference: payload.burial_case.public_reference,
          status: payload.burial_case.status,
          approx_location_text: payload.burial_case.approx_location_text
        },
        timeline,
        current_location_inferred: {
          location_code: lastConfirmed ? currentLocationCode : null,
          as_of_occurred_on: lastConfirmed?.occurred_on || null
        },
        warnings
      }
    };
  }
}
