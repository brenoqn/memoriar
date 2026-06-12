import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { AdminRemainsMovementListItem } from '@memoriar/shared';

import { AdminRemainsMovementsService } from '../../core/services/admin-remains-movements.service';

@Component({
  selector: 'mem-admin-remains-movements-page',
  imports: [CommonModule],
  templateUrl: './admin-remains-movements.page.html',
  styleUrl: './admin-remains-movements.page.css'
})
export class AdminRemainsMovementsPageComponent {
  protected readonly movements = signal<AdminRemainsMovementListItem[]>([]);
  protected readonly selectedId = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly selected = computed(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.movements().find((m) => m.id === id) || null;
  });

  constructor(private readonly service: AdminRemainsMovementsService) {
    this.service.list().subscribe({
      next: (items) => {
        this.movements.set(items);
        if (items[0]?.id) this.selectedId.set(items[0].id);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar as movimentações agora.');
        this.loading.set(false);
      }
    });
  }

  select(id: string) {
    this.selectedId.set(id);
  }
}

