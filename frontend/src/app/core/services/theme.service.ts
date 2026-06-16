import { Injectable, computed, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'memoriar.ui.theme.v1';

function readStoredTheme(): ThemeMode | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
    return null;
  } catch {
    return null;
  }
}

function getSystemTheme(): ThemeMode {
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly hasPreferenceSig = signal<boolean>(readStoredTheme() !== null);
  private readonly modeSig = signal<ThemeMode>(readStoredTheme() ?? getSystemTheme());

  readonly mode = computed(() => this.modeSig());
  readonly hasPreference = computed(() => this.hasPreferenceSig());
  readonly shouldAskUser = computed(() => !this.hasPreferenceSig());

  init() {
    this.applyToDocument(this.modeSig());
  }

  setMode(mode: ThemeMode) {
    this.modeSig.set(mode);
    this.hasPreferenceSig.set(true);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
    this.applyToDocument(mode);
  }

  toggle() {
    this.setMode(this.modeSig() === 'dark' ? 'light' : 'dark');
  }

  private applyToDocument(mode: ThemeMode) {
    const root = document.documentElement;
    root.dataset['theme'] = mode;
    // Ajuda o browser a escolher cores nativas (inputs, scrollbar, etc.)
    root.style.colorScheme = mode;
  }
}

