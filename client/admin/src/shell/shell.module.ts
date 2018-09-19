import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { LoginPage } from './page/login/component';
import { ReactiveFormsModule} from "@angular/forms";
import { FlexLayoutModule} from "@angular/flex-layout";
import {
  MatCardModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSnackBarModule
} from '@angular/material';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {Admin} from "./service/admin";
import { DashboardPage } from './page/dashboard/component';
import {AuthenticationInterceptor} from "./authentication.interceptor";
import {DefaultPage} from "./page/default";

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,

    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule
  ],
  declarations: [DashboardPage, LoginPage, DefaultPage],
  exports: [],
  providers: [
    Admin,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }
  ]
})
export class ShellModule { }
