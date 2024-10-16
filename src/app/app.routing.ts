import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/components/main-layout/main-layout/main-layout.component';
import { AuthComponent } from './core/components/auth/auth/auth.component';



export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },

  {
    path: '',
    component: AuthComponent,
    children: [
        {
      path: '',
      loadChildren: () => import('./core/components/auth/auth/auth.module').then(x => x.AuthModule)
  }]},


  {
    path: '',
    component: MainLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: () => import('./core/components/main-layout/main-layout/main-layout.module').then(x => x.MainLayoutModule)
  }]},

  {
    path: '**',
    redirectTo: 'dashboard'
  }
]
