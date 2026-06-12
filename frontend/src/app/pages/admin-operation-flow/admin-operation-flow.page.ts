import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type {
  AdminBurialLocationListItem,
  AdminOperationFlowPayload,
  AdminOperationFlowPreview,
  AdminOperationFlowMovementItem,
  AdminOperationFlowValidationError,
  AdminOperationMovementType,
  RecordStatus
} from '@memoriar/shared';

import { AdminBurialLocationsService } from '../../core/services/admin-burial-locations.service';
import { AdminOperationFlowService } from '../../core/services/admin-operation-flow.service';
import { mockAdminBurialLocations, mockAdminCemeteries, mockAdminQuadras, mockAdminSectors } from '../../mocks/admin.mock';

type Step = 1 | 2 | 3 | 4;

type StepVm = { id: Step; label: string };

const STEPS: StepVm[] = [
  { id: 1, label: 'Local físico' },
  { id: 2, label: 'Caso' },
  { id: 3, label: 'Movimentação' },
  { id: 4, label: 'Resumo' }
];

const MOVEMENT_OPTIONS: { value: AdminOperationMovementType; label: string }[] = [
  { value: 'burial', label: 'Sepultamento' },
  { value: 'transfer', label: 'Transferência' },
  { value: 'exhumation', label: 'Exumação' },
  { value: 'relocation', label: 'Remanejamento' },
  { value: 'ossuary_transfer', label: 'Transferência para ossuário' }
];

const STATUS_OPTIONS: { value: Extract<RecordStatus, 'draft' | 'in_review' | 'not_found_precisely'>; label: string }[] = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'in_review', label: 'Em revisão' },
  { value: 'not_found_precisely', label: 'Localização não confirmada' }
];

@Component({
  selector: 'mem-admin-operation-flow-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-operation-flow.page.html',
  styleUrl: './admin-operation-flow.page.css'
})
export class AdminOperationFlowPageComponent {
  protected readonly step = signal<Step>(1);

  protected readonly busy = signal(false);
  protected readonly preview = signal<AdminOperationFlowPreview | null>(null);
  protected readonly previewErrors = signal<AdminOperationFlowValidationError[]>([]);
  protected readonly previewMessage = signal<string | null>(null);
  protected readonly uiFeedback = signal<string | null>(null);
  protected readonly finished = signal(false);

  protected readonly locations = signal<AdminBurialLocationListItem[]>([]);
  protected readonly movements = signal<
    Array<AdminOperationFlowMovementItem & { local_id: string; adjusted: boolean }>
  >([]);
  protected readonly editingMovementId = signal<string | null>(null);

  protected readonly steps = STEPS;
  protected readonly movementOptions = MOVEMENT_OPTIONS;
  protected readonly statusOptions = STATUS_OPTIONS;

  private readonly fb = new FormBuilder();

  protected readonly locationForm = this.fb.group({
    mode: this.fb.control<'existing' | 'new' | 'not_confirmed'>('existing', { nonNullable: true }),
    existing_location_id: this.fb.control<string>('', { nonNullable: true }),
    new_cemetery_id: this.fb.control<string>('', { nonNullable: true }),
    new_sector_id: this.fb.control<string>('', { nonNullable: true }),
    new_quadra_id: this.fb.control<string>('', { nonNullable: true }),
    new_type_code: this.fb.control<string>('JZ', { nonNullable: true }),
    new_code: this.fb.control<string>('', { nonNullable: true }),
    new_location_text: this.fb.control<string>('', { nonNullable: true }),
    new_map_node_id: this.fb.control<string>('', { nonNullable: true })
  });

  protected readonly caseForm = this.fb.group({
    deceased_name: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    public_reference: this.fb.control<string>('', { nonNullable: true }),
    status: this.fb.control<'draft' | 'in_review' | 'not_found_precisely'>('in_review', { nonNullable: true }),
    approx_location_text: this.fb.control<string>('', { nonNullable: true }),
    notes: this.fb.control<string>('', { nonNullable: true })
  });

  protected readonly movementForm = this.fb.group({
    movement_type: this.fb.control<AdminOperationMovementType>('burial', { nonNullable: true }),
    occurred_on: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    from_location_code: this.fb.control<string>('', { nonNullable: true }),
    to_location_code: this.fb.control<string>('', { nonNullable: true }),
    is_confirmed: this.fb.control<boolean>(true, { nonNullable: true }),
    notes: this.fb.control<string>('', { nonNullable: true })
  });

  protected readonly selectedExistingLocation = computed(() => {
    const id = this.locationForm.controls.existing_location_id.value;
    if (!id) return null;
    return this.locations().find((l) => l.id === id) || null;
  });

  protected readonly canNext = computed(() => {
    const s = this.step();
    if (s === 1) return this.validateStep1();
    if (s === 2) return this.validateStep2();
    if (s === 3) return this.validateStep3();
    return true;
  });

  constructor(
    private readonly locationsService: AdminBurialLocationsService,
    private readonly flowService: AdminOperationFlowService
  ) {
    this.locationsService.list().subscribe({
      next: (items) => {
        this.locations.set(items);
        const first = items.find((x) => x.status === 'published') || items[0] || null;
        if (first?.id) {
          this.locationForm.controls.existing_location_id.setValue(first.id);
          this.movementForm.controls.to_location_code.setValue(first.code);
        }

        const cem = mockAdminCemeteries()[0];
        const s1 = mockAdminSectors()[0];
        const q1 = mockAdminQuadras()[0];
        if (cem?.id) this.locationForm.controls.new_cemetery_id.setValue(cem.id);
        if (s1?.id) this.locationForm.controls.new_sector_id.setValue(s1.id);
        if (q1?.id) this.locationForm.controls.new_quadra_id.setValue(q1.id);
      },
      error: () => {
        const fallback = mockAdminBurialLocations();
        this.locations.set(fallback);
      }
    });

    this.locationForm.controls.mode.valueChanges.subscribe(() => {
      this.preview.set(null);
      this.previewErrors.set([]);
      this.previewMessage.set(null);
    });

    this.locationForm.controls.existing_location_id.valueChanges.subscribe((id) => {
      const loc = this.locations().find((l) => l.id === id) || null;
      if (loc && this.movementForm.controls.movement_type.value === 'burial') {
        this.movementForm.controls.to_location_code.setValue(loc.code);
      }
    });

    this.caseForm.controls.status.valueChanges.subscribe((status) => {
      if (status !== 'not_found_precisely') return;
      if (!this.caseForm.controls.approx_location_text.value && !this.caseForm.controls.notes.value) {
        this.caseForm.controls.approx_location_text.setValue('Indícios: setor/quadra aproximados. Localização exata pendente de revisão.');
      }
    });

    this.movementForm.controls.movement_type.valueChanges.subscribe((t) => {
      if (t === 'burial') {
        const loc = this.selectedExistingLocation();
        if (loc) this.movementForm.controls.to_location_code.setValue(loc.code);
        this.movementForm.controls.from_location_code.setValue('');
      }
      if (t === 'exhumation') {
        this.movementForm.controls.to_location_code.setValue('');
      }
    });
  }

  goTo(step: Step) {
    this.step.set(step);
  }

  next() {
    if (!this.canNext()) return;
    const s = this.step();
    if (s < 4) this.step.set((s + 1) as Step);
    if (s + 1 === 4) this.generatePreview();
  }

  back() {
    const s = this.step();
    if (s > 1) this.step.set((s - 1) as Step);
  }

  finish() {
    this.finished.set(true);
    this.previewMessage.set('Demonstração finalizada. Nenhuma informação foi salva em banco.');
  }

  private validateStep1() {
    const mode = this.locationForm.controls.mode.value;
    if (mode === 'not_confirmed') return true;
    if (mode === 'existing') return !!this.locationForm.controls.existing_location_id.value;
    if (mode === 'new') return !!this.locationForm.controls.new_code.value.trim();
    return false;
  }

  private validateStep2() {
    if (!this.caseForm.controls.deceased_name.value.trim()) return false;
    const status = this.caseForm.controls.status.value;
    const approx = this.caseForm.controls.approx_location_text.value.trim();
    const notes = this.caseForm.controls.notes.value.trim();
    if (status === 'not_found_precisely' && !approx && !notes) return false;
    return true;
  }

  private validateStep3() {
    return this.movements().length > 0;
  }

  protected canAddOrUpdateMovement() {
    const type = this.movementForm.controls.movement_type.value;
    const occurredOn = this.movementForm.controls.occurred_on.value.trim();
    if (!type) return false;
    if (!occurredOn) return false;

    const from = this.movementForm.controls.from_location_code.value.trim();
    const to = this.movementForm.controls.to_location_code.value.trim();
    const needsFrom = type !== 'burial';
    const needsTo = type !== 'exhumation';
    if (needsFrom && !from) return false;
    if (needsTo && !to) return false;
    return true;
  }

  protected addOrUpdateMovement() {
    if (!this.canAddOrUpdateMovement()) {
      this.uiFeedback.set('Preencha tipo e data (e origem/destino quando aplicável).');
      window.setTimeout(() => this.uiFeedback.set(null), 2000);
      return;
    }

    const item: AdminOperationFlowMovementItem = {
      movement_type: this.movementForm.controls.movement_type.value,
      occurred_on: this.movementForm.controls.occurred_on.value.trim(),
      from_location_code: this.movementForm.controls.from_location_code.value.trim() || null,
      to_location_code: this.movementForm.controls.to_location_code.value.trim() || null,
      is_confirmed: this.movementForm.controls.is_confirmed.value,
      notes: this.movementForm.controls.notes.value.trim() || null
    };

    const editingId = this.editingMovementId();
    const current = this.movements();
    const next = editingId
      ? current.map((m) =>
          m.local_id === editingId ? { ...m, ...item, adjusted: true } : m
        )
      : [
          ...current,
          { ...item, local_id: crypto.randomUUID(), adjusted: false }
        ];

    next.sort((a, b) => new Date(a.occurred_on).getTime() - new Date(b.occurred_on).getTime());
    this.movements.set(next);

    this.editingMovementId.set(null);
    this.preview.set(null);
    this.previewErrors.set([]);
    this.previewMessage.set(null);

    this.uiFeedback.set(
      editingId
        ? 'Movimentação ajustada localmente (demonstração).'
        : 'Movimentação adicionada ao histórico demonstrativo.'
    );
    window.setTimeout(() => this.uiFeedback.set(null), 2000);
  }

  protected editMovement(localId: string) {
    const item = this.movements().find((m) => m.local_id === localId) || null;
    if (!item) return;
    this.editingMovementId.set(localId);
    this.movementForm.controls.movement_type.setValue(item.movement_type);
    this.movementForm.controls.occurred_on.setValue(item.occurred_on);
    this.movementForm.controls.from_location_code.setValue(item.from_location_code || '');
    this.movementForm.controls.to_location_code.setValue(item.to_location_code || '');
    this.movementForm.controls.is_confirmed.setValue(item.is_confirmed);
    this.movementForm.controls.notes.setValue(item.notes || '');
    this.uiFeedback.set('Editando movimentação (ajuste local de demonstração).');
    window.setTimeout(() => this.uiFeedback.set(null), 2000);
  }

  protected removeMovement(localId: string) {
    const next = this.movements().filter((m) => m.local_id !== localId);
    this.movements.set(next);
    if (this.editingMovementId() === localId) this.editingMovementId.set(null);
    this.preview.set(null);
    this.previewErrors.set([]);
    this.previewMessage.set(null);
    this.uiFeedback.set('Movimentação removida do histórico demonstrativo.');
    window.setTimeout(() => this.uiFeedback.set(null), 2000);
  }

  protected inferredCurrentLocationFromLocalHistory() {
    const lastConfirmed = [...this.movements()].reverse().find((m) => m.is_confirmed) || null;
    if (!lastConfirmed) return null;
    if (lastConfirmed.movement_type === 'exhumation') return null;
    return lastConfirmed.to_location_code || null;
  }

  private buildPayload(): AdminOperationFlowPayload {
    const mode = this.locationForm.controls.mode.value;
    const existingId = this.locationForm.controls.existing_location_id.value || null;

    const new_location =
      mode !== 'new'
        ? null
        : {
            cemetery_id: this.locationForm.controls.new_cemetery_id.value,
            sector_id: this.locationForm.controls.new_sector_id.value,
            quadra_id: this.locationForm.controls.new_quadra_id.value || null,
            type_code: this.locationForm.controls.new_type_code.value,
            code: this.locationForm.controls.new_code.value.trim(),
            location_text: this.locationForm.controls.new_location_text.value.trim() || null,
            map_node_id: this.locationForm.controls.new_map_node_id.value.trim() || null
          };

    const status = this.caseForm.controls.status.value;
    return {
      location: {
        mode,
        existing_location_id: mode === 'existing' ? existingId : null,
        new_location
      },
      burial_case: {
        deceased_name: this.caseForm.controls.deceased_name.value.trim(),
        public_reference: this.caseForm.controls.public_reference.value.trim() || null,
        status,
        approx_location_text: this.caseForm.controls.approx_location_text.value.trim() || null,
        notes: this.caseForm.controls.notes.value.trim() || null
      },
      movements: this.movements().map((m) => ({
        movement_type: m.movement_type,
        occurred_on: m.occurred_on,
        from_location_code: m.from_location_code,
        to_location_code: m.to_location_code,
        is_confirmed: m.is_confirmed,
        notes: m.notes
      }))
    };
  }

  generatePreview() {
    this.preview.set(null);
    this.previewErrors.set([]);
    this.previewMessage.set(null);
    this.finished.set(false);
    this.busy.set(true);

    const payload = this.buildPayload();
    this.flowService.preview(payload).subscribe((res) => {
      this.busy.set(false);
      if (res.kind === 'ok') {
        this.preview.set(res.preview);
        this.previewMessage.set('Prévia gerada. Nenhuma informação foi salva em banco.');
        return;
      }
      this.previewErrors.set(res.errors);
      this.previewMessage.set(res.message);
    });
  }
}
