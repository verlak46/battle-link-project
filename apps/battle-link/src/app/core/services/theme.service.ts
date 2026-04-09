import { Injectable, signal } from '@angular/core';

export type AppTheme = 'dark' | 'light';

const STORAGE_KEY = 'battle-link-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _current = signal<AppTheme>(
    (localStorage.getItem(STORAGE_KEY) as AppTheme) ?? 'dark',
  );

  readonly current = this._current.asReadonly();

  init(): void {
    this.applyTheme(this._current());
  }

  setTheme(theme: AppTheme): void {
    if (theme === this._current()) return;
    localStorage.setItem(STORAGE_KEY, theme);
    this._current.set(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: AppTheme): void {
    document.documentElement.classList.toggle('ion-palette-dark', theme === 'dark');
  }
}
