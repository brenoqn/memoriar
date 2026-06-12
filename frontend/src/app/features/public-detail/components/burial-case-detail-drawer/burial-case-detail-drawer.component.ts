import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { PublicDeceasedDetail } from '@memoriar/shared';

@Component({
  selector: 'mem-burial-case-detail-drawer',
  imports: [CommonModule],
  templateUrl: './burial-case-detail-drawer.component.html',
  styleUrl: './burial-case-detail-drawer.component.css'
})
export class BurialCaseDetailDrawerComponent {
  @Input({ required: true }) open = false;
  @Input({ required: true }) detail: PublicDeceasedDetail | null = null;
  @Output() closed = new EventEmitter<void>();

  protected readonly copyFeedback = signal<string | null>(null);

  close() {
    this.closed.emit();
  }

  async copyReferenceOrLink() {
    const d = this.detail;
    if (!d) return;
    const text =
      d.public_reference ||
      `${window.location.origin}/?caseId=${encodeURIComponent(d.burial_case_id)}`;
    try {
      await navigator.clipboard.writeText(text);
      this.copyFeedback.set(d.public_reference ? 'Referência copiada.' : 'Link copiado.');
    } catch {
      this.copyFeedback.set('Não foi possível copiar agora.');
    }
    window.setTimeout(() => this.copyFeedback.set(null), 2000);
  }

  statusLabel(detail: PublicDeceasedDetail) {
    if (detail.status === 'published') return 'Publicado';
    if (detail.status === 'in_review') return 'Em revisão';
    if (detail.status === 'draft') return 'Rascunho';
    if (detail.status === 'archived') return 'Arquivado';
    if (detail.status === 'not_found_precisely') return 'Localização não confirmada';
    return detail.status;
  }
}
