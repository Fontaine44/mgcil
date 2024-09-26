import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'yapper',
  },
  {
    path: '**',
    redirectTo: 'yapper',
  },
  {
    path: 'yapper',
    loadComponent: () => import('./components/yapper/yapper.component').then(m => m.YapperComponent)
  }
];
