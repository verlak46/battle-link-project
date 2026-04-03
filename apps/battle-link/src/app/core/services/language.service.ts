import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'es' | 'en';

const STORAGE_KEY = 'battle-link-lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);

  get current(): AppLanguage {
    return (localStorage.getItem(STORAGE_KEY) as AppLanguage) ?? 'es';
  }

  init(): void {
    this.translate.use(this.current);
  }

  setLanguage(lang: AppLanguage): void {
    if (lang === this.current) return;
    localStorage.setItem(STORAGE_KEY, lang);
    window.location.reload();
  }
}
