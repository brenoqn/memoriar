import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { AdminDataQualityResponse } from '@memoriar/shared';

import { AdminDataQualityService } from '../../core/services/admin-data-quality.service';

@Component({
  selector: 'mem-admin-data-quality-page',
  imports: [CommonModule],
  templateUrl: './admin-data-quality.page.html',
  styleUrl: './admin-data-quality.page.css'
})
export class AdminDataQualityPageComponent {
  protected readonly data = signal<AdminDataQualityResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor(private readonly service: AdminDataQualityService) {
    this.service.get().subscribe({
      next: (d) => {
        this.data.set(d);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar a qualidade dos dados agora.');
        this.loading.set(false);
      }
    });
  }
}

