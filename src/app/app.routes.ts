import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import {AuthGuard} from '../app/app_core/core/auth.guard'
const routes: Routes = [
   {
    path: '',
    redirectTo: '/notes',
    pathMatch: 'full',
    canActivate: [ AuthGuard ]
  },
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutes { }