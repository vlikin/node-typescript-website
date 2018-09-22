import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { LoginPageComponent } from './page/login/component';
import { ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule} from '@angular/flex-layout';
import {
  MatCardModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSnackBarModule,
  MatTableModule,
  MatMenuModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDividerModule
} from '@angular/material';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { DashboardPage } from './page/dashboard/component';
import {AuthenticationInterceptor} from './authentication.interceptor';
import {DefaultPage} from './page/default';
import {PostListPageComponent} from './page/post/list';
import {AdminService} from './service/admin';
import {EditPostDialogComponent} from './dialog/edit-post';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,

    MatButtonModule,
    MatDatepickerModule,
    MatDividerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTableModule,
  ],
  declarations: [
    DashboardPage,
    LoginPageComponent,
    DefaultPage,
    PostListPageComponent,

    EditPostDialogComponent
  ],
  exports: [],
  providers: [
    AdminService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    EditPostDialogComponent
  ]
})
export class ShellModule { }
