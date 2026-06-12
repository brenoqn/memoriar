import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { AdminBurialCaseListItem } from '@memoriar/shared';

import { AdminBurialCasesService } from '../../core/services/admin-burial-cases.service';

@Component({
  selector: 'mem-admin-burial-cases-page',
  imports: [CommonModule],
  templateUrl: './admin-burial-cases.page.html',
  styleUrl: './admin-burial-cases.page.css'
})
export class AdminBurialCasesPageComponent {
  protected readonly cases = signal<AdminBurialCaseListItem[]>([]);
  protected readonly selectedId = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly selected = computed(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.cases().find((c) => c.burial_case_id === id) || null;
  });

  constructor(private readonly service: AdminBurialCasesService) {
    this.service.list().subscribe({
      next: (items) => {
        this.cases.set(items);
        if (items[0]?.burial_case_id) this.selectedId.set(items[0].burial_case_id);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os casos agora.');
        this.loading.set(false);
      }
    });
  }

  select(id: string) {
    this.selectedId.set(id);
  }
}

