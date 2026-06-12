import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mem-admin-editor-panel',
  imports: [CommonModule],
  templateUrl: './admin-editor-panel.component.html',
  styleUrl: './admin-editor-panel.component.css'
})
export class AdminEditorPanelComponent {
  @Input({ required: true }) entityId: string | null = null;
}

