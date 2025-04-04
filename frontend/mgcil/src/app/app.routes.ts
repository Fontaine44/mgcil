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
    path: 'translator',
    loadComponent: () => import('./components/translator/translator.component').then(m => m.TranslatorComponent)
  },
  {
    path: 'die',
    loadComponent: () => import('./components/die/die.component').then(m => m.DieComponent)
  },
  {
    path: 'lapoly.ca',
    loadComponent: () => import('./components/lapoly/lapoly.component').then(m => m.LapolyComponent)
  },
  {
    path: 'bolt-tracker',
    loadComponent: () => import('./components/bolt/bolt.component').then(m => m.BoltComponent)
  },
  {
    path: 'igor',
    loadComponent: () => import('./components/igor/igor.component').then(m => m.IgorComponent)
  },
  {
    path: 'tacoteq',
    loadComponent: () => import('./components/tacoteq/tacoteq.component').then(m => m.TacoteqComponent)
  },
  {
    path: 'poke',
    loadComponent: () => import('./components/poke/poke.component').then(m => m.PokeComponent)
  },
  {
    path: 'countdown',
    loadComponent: () => import('./components/countdown/countdown.component').then(m => m.CountdownComponent)
  },
  {
    path: 'degrise',
    loadComponent: () => import('./components/degrise/degrise.component').then(m => m.DegriseComponent)
  },
  {
    path: '**',
    redirectTo: '',
  }
];
