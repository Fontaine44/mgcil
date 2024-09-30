import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'yapper',
    loadComponent: () => import('./components/yapper/yapper.component').then(m => m.YapperComponent)
  },
  {
    path: '**',
    redirectTo: '',
  }
];
