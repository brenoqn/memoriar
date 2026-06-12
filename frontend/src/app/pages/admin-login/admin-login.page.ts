import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AdminAuthService } from '../../core/services/admin-auth.service';

@Component({
  selector: 'mem-admin-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.page.html',
  styleUrl: './admin-login.page.css'
})
export class AdminLoginPageComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private readonly auth: AdminAuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  submit() {
    if (this.busy()) return;
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.busy.set(true);
    this.auth
      .login(email, password)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          const returnUrl =
            this.route.snapshot.queryParamMap.get('returnUrl')?.trim() || '/admin';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err: unknown) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.error.set('E-mail ou senha inválidos.');
              return;
            }
            if (err.status === 403) {
              this.error.set('Usuário sem permissão administrativa.');
              return;
            }
            if (err.status === 503 && err.error?.kind === 'supabase_not_configured') {
              this.error.set('Supabase não configurado no backend.');
              return;
            }
          }
          this.error.set('Não foi possível acessar agora.');
        }
      });
  }
}
