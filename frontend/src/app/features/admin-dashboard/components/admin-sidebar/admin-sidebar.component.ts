import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AdminAuthService } from '../../../../core/services/admin-auth.service';

@Component({
  selector: 'mem-admin-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
  constructor(
    private readonly auth: AdminAuthService,
    private readonly router: Router
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/admin/login');
  }
}
