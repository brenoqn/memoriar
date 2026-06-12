import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { AdminOverview } from '@memoriar/shared';

import { AdminOverviewService } from '../../core/services/admin-overview.service';

@Component({
  selector: 'mem-admin-overview-page',
  imports: [CommonModule],
  templateUrl: './admin-overview.page.html',
  styleUrl: './admin-overview.page.css'
})
export class AdminOverviewPageComponent {
  protected readonly overview = signal<AdminOverview | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor(private readonly overviewService: AdminOverviewService) {
    this.overviewService.get().subscribe({
      next: (data) => {
        this.overview.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar o resumo agora.');
        this.loading.set(false);
      }
    });
  }
}

