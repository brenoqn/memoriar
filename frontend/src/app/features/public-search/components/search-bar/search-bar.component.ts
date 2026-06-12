import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'mem-search-bar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @Input({ required: true }) busy = false;
  @Output() searchRequested = new EventEmitter<{ q: string }>();

  private readonly fb = inject(FormBuilder);
  protected readonly submitted = signal(false);

  protected readonly form = this.fb.group({
    q: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]]
  });

  submit() {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const q = (this.form.value.q || '').trim();
    this.searchRequested.emit({ q });
  }
}
