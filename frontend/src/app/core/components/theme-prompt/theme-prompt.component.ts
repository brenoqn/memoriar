import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';

import { ThemeService, type ThemeMode } from '../../services/theme.service';

@Component({
  selector: 'mem-theme-prompt',
  imports: [NgIf],
  templateUrl: './theme-prompt.component.html',
  styleUrl: './theme-prompt.component.css'
})
export class ThemePromptComponent {
  readonly theme = inject(ThemeService);

  set(mode: ThemeMode) {
    this.theme.setMode(mode);
  }
}

