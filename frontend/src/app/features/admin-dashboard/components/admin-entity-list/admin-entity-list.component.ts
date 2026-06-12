import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mem-admin-entity-list',
  imports: [CommonModule],
  templateUrl: './admin-entity-list.component.html',
  styleUrl: './admin-entity-list.component.css'
})
export class AdminEntityListComponent<T extends { id: string }> {
  @Input({ required: true }) items: T[] = [];
  @Input({ required: true }) selectedId: string | null = null;
  @Input({ required: true }) labelKey!: keyof T;
  @Output() selected = new EventEmitter<string>();

  labelOf(item: T) {
    const v = item[this.labelKey];
    return typeof v === 'string' ? v : String(v);
  }
}

