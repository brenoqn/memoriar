import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { AdminQuadraListItem, AdminSectorListItem } from '@memoriar/shared';

import { AdminSectorsService } from '../../core/services/admin-sectors.service';
import { AdminQuadrasService } from '../../core/services/admin-quadras.service';

type Tab = 'sectors' | 'quadras';

@Component({
  selector: 'mem-admin-structure-page',
  imports: [CommonModule],
  templateUrl: './admin-structure.page.html',
  styleUrl: './admin-structure.page.css'
})
export class AdminStructurePageComponent {
  protected readonly tab = signal<Tab>('sectors');
  protected readonly sectors = signal<AdminSectorListItem[]>([]);
  protected readonly quadras = signal<AdminQuadraListItem[]>([]);
  protected readonly selectedId = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly selected = computed(() => {
    const id = this.selectedId();
    if (!id) return null;
    return (
      this.sectors().find((s) => s.id === id) ||
      this.quadras().find((q) => q.id === id) ||
      null
    );
  });

  constructor(
    private readonly sectorsService: AdminSectorsService,
    private readonly quadrasService: AdminQuadrasService
  ) {
    let pending = 2;
    const done = () => {
      pending -= 1;
      if (pending <= 0) this.loading.set(false);
    };

    this.sectorsService.list().subscribe({
      next: (items) => {
        this.sectors.set(items);
        done();
      },
      error: () => {
        this.error.set('Não foi possível carregar setores/quadras agora.');
        done();
      }
    });

    this.quadrasService.list().subscribe({
      next: (items) => {
        this.quadras.set(items);
        done();
      },
      error: () => {
        this.error.set('Não foi possível carregar setores/quadras agora.');
        done();
      }
    });
  }

  setTab(tab: Tab) {
    this.tab.set(tab);
    this.selectedId.set(null);
  }

  select(id: string) {
    this.selectedId.set(id);
  }
}

