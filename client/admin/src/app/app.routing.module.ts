import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginPage} from "../shell/page/login/component";
import {IsAuthenticatedGuard} from "../shell/is-authenticated.guard";
import {DashboardPage} from "../shell/page/dashboard/component";
import {DefaultPage} from "../shell/page/default";

const routes: Routes = [
  {
    path: '',
    component: DefaultPage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [IsAuthenticatedGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
