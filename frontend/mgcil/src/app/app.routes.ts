import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
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
