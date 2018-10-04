import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginPageComponent} from '../shell/page/login/component';
import {IsAuthenticatedGuard} from '../shell/is-authenticated.guard';
import {DashboardPage} from '../shell/page/dashboard/component';
import {DefaultPage} from '../shell/page/default';
import {PostListPageComponent} from '../shell/page/post/list';
import {PostEditPageComponent} from '../shell/page/post/edit';
import {PagePageComponent} from '../shell/page/page/component';
import {ResumeEditPageComponent} from '../shell/page/resume/edit';
import {ResumeListPageComponent} from '../shell/page/resume/list';

const routes: Routes = [
  {
    path: '',
    component: DefaultPage,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'page',
    component: PagePageComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'post/list',
    component: PostListPageComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'post/edit/:_id',
    component: PostEditPageComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'resume/list',
    component: ResumeListPageComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'resume/edit/:_id',
    component: ResumeEditPageComponent,
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
