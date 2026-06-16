import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'mem-public-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css'
})
export class PublicLayoutComponent {
  readonly theme = inject(ThemeService);

  toggleTheme() {
    this.theme.toggle();
  }
}
