import { Routes } from '@angular/router';
import { TabsPage } from './tabs';

export const tabsRoutes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'map',
        loadComponent: () =>
          import('../../features/map/map').then((m) => m.MapPage),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('../../features/search/search').then((m) => m.SearchPage),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('../../features/new/new').then((m) => m.NewPage),
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('../../features/chat/chat').then((m) => m.ChatPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../../features/profile/profile').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full',
      },
    ],
  },
];
