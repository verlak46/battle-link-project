import { Routes } from '@angular/router';
import { TabsPage } from './tabs';

export const tabsRoutes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../../features/home/home').then((m) => m.HomePage),
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('../../features/explore/explore').then((m) => m.ExplorePage),
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
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
