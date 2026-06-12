import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Cemetery } from '@memoriar/shared';

import { AdminCemeteriesService } from '../../core/services/admin-cemeteries.service';

@Component({
  selector: 'mem-admin-cemeteries-page',
  imports: [CommonModule],
  templateUrl: './admin-cemeteries.page.html',
  styleUrl: './admin-cemeteries.page.css'
})
export class AdminCemeteriesPageComponent {
  protected readonly cemeteries = signal<Cemetery[]>([]);
  protected readonly selectedId = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly selected = computed(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.cemeteries().find((c) => c.id === id) || null;
  });

  constructor(private readonly cemeteriesService: AdminCemeteriesService) {
    this.cemeteriesService.list().subscribe({
      next: (items) => {
        this.cemeteries.set(items);
        if (items[0]?.id) this.selectedId.set(items[0].id);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os cemitérios agora.');
        this.loading.set(false);
      }
    });
  }

  select(id: string) {
    this.selectedId.set(id);
  }
}

