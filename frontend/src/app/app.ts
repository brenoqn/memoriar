import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemePromptComponent } from './core/components/theme-prompt/theme-prompt.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemePromptComponent],
  template: `
    <router-outlet />
    <mem-theme-prompt />
  `
})
export class App {
  constructor(theme: ThemeService) {
    theme.init();
  }
}
