import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  ErrorHandler,
  LOCALE_ID,
  inject,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import { provideRouter, Router } from '@angular/router';
import { loadGoogleMapsApi } from './core/utils/google-maps-loader';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import * as Sentry from '@sentry/angular';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { LanguageService } from './core/services/language.service';
import { ThemeService } from './core/services/theme.service';

registerLocaleData(localeEs);
registerLocaleData(localeEn);

if (environment.sentryDsn) {
  Sentry.init({
    dsn: environment.sentryDsn,
    environment: environment.production ? 'production' : 'development',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: environment.production ? 0.2 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

export const firebaseApp = initializeApp(environment.firebase);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: ErrorHandler, useValue: Sentry.createErrorHandler() },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: LOCALE_ID,
      useFactory: () => localStorage.getItem('battle-link-lang') ?? 'es',
    },
    provideAppInitializer(() => {
      inject(Sentry.TraceService);
    }),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'es',
      lang: 'es',
    }),
    provideAppInitializer(() => {
      inject(LanguageService).init();
    }),
    provideAppInitializer(() => {
      inject(ThemeService).init();
    }),
    provideAppInitializer(loadGoogleMapsApi(environment.googleMapsApiKey)),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideIonicAngular(),
  ],
};
