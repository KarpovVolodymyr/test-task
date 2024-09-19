import { Route } from '@angular/router';

export const appRoutes: Route [] = [
  {
    path: 'users',
    loadChildren: () => import('./users/feature/users.module').then((m) => m.UsersModule),
  },

  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full',
  },
];
