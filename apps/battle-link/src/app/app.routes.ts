import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/forgot-password/forgot-password').then((m) => m.ForgotPasswordPage),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/reset-password/reset-password').then((m) => m.ResetPasswordPage),
  },
  {
    path: 'onboarding',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/onboarding/onboarding').then((m) => m.OnboardingPage),
  },
  {
    path: 'places/nueva',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/places/nueva-place/nueva-place').then((m) => m.NuevaPlacePage),
  },
  {
    path: 'admin/places',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/places-pendientes/places-pendientes').then((m) => m.PlacesPendientesPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./layout/tabs/tabs.routes').then((m) => m.tabsRoutes),
  },
  { path: '**', redirectTo: '' },
];
