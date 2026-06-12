import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { PublicDeceasedSearchItem } from '@memoriar/shared';

@Component({
  selector: 'mem-result-list',
  imports: [CommonModule],
  templateUrl: './result-list.component.html',
  styleUrl: './result-list.component.css'
})
export class ResultListComponent {
  @Input({ required: true }) items: PublicDeceasedSearchItem[] = [];
  @Input({ required: true }) selectedId: string | null = null;
  @Output() selected = new EventEmitter<string>();

  trackById = (_: number, item: PublicDeceasedSearchItem) => item.burial_case_id;

  private readonly dtf = new Intl.DateTimeFormat('pt-BR');

  formatDate(value: string | null) {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return this.dtf.format(d);
  }

  cardAriaLabel(item: PublicDeceasedSearchItem) {
    const parts: string[] = [];
    parts.push(item.deceased_name);
    if (item.public_reference) parts.push(`referência ${item.public_reference}`);
    parts.push(item.cemetery_name);
    if (item.sector_code || item.sector_name) {
      parts.push(`setor ${item.sector_code || ''} ${item.sector_name || ''}`.trim());
    }
    if (item.quadra_code || item.quadra_name) {
      parts.push(`quadra ${item.quadra_code || ''} ${item.quadra_name || ''}`.trim());
    }
    if (item.location_code) parts.push(`local ${item.location_code}`);
    return parts.filter(Boolean).join(', ');
  }
}
