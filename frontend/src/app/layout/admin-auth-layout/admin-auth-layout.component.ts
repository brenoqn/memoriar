import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'mem-admin-auth-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './admin-auth-layout.component.html',
  styleUrl: './admin-auth-layout.component.css'
})
export class AdminAuthLayoutComponent {}

