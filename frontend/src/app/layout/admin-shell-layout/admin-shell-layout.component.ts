import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AdminSidebarComponent } from '../../features/admin-dashboard/components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'mem-admin-shell-layout',
  imports: [RouterOutlet, AdminSidebarComponent],
  templateUrl: './admin-shell-layout.component.html',
  styleUrl: './admin-shell-layout.component.css'
})
export class AdminShellLayoutComponent {}

