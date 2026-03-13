import { Routes } from '@angular/router';
import { TabsPage } from './tabs';

export const tabsRoutes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'mapa',
        loadComponent: () =>
          import('../../features/mapa/mapa').then((m) => m.MapaPage),
      },
      {
        path: 'buscar',
        loadComponent: () =>
          import('../../features/buscar/buscar').then((m) => m.BuscarPage),
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('../../features/nuevo/nuevo').then((m) => m.NuevoPage),
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('../../features/chat/chat').then((m) => m.ChatPage),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('../../features/perfil/perfil').then((m) => m.PerfilPage),
      },
      {
        path: '',
        redirectTo: 'mapa',
        pathMatch: 'full',
      },
    ],
  },
];
