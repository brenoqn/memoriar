import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { AdminBurialLocationListItem } from '@memoriar/shared';

import { AdminBurialLocationsService } from '../../core/services/admin-burial-locations.service';

@Component({
  selector: 'mem-admin-burial-locations-page',
  imports: [CommonModule],
  templateUrl: './admin-burial-locations.page.html',
  styleUrl: './admin-burial-locations.page.css'
})
export class AdminBurialLocationsPageComponent {
  protected readonly locations = signal<AdminBurialLocationListItem[]>([]);
  protected readonly selectedId = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly selected = computed(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.locations().find((l) => l.id === id) || null;
  });

  constructor(private readonly service: AdminBurialLocationsService) {
    this.service.list().subscribe({
      next: (items) => {
        this.locations.set(items);
        if (items[0]?.id) this.selectedId.set(items[0].id);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os locais físicos agora.');
        this.loading.set(false);
      }
    });
  }

  select(id: string) {
    this.selectedId.set(id);
  }
}

