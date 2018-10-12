import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutModule} from '@angular/cdk/layout';
import {LoginPageComponent} from './page/login/component';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatNativeDateModule,
  MatSnackBarModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DashboardPageComponent} from './page/dashboard/component';
import {AuthenticationInterceptor} from './authentication.interceptor';
import {DefaultPage} from './page/default';
import {PostListPageComponent} from './page/post/list';
import {AdminService} from './service/admin';
import {PostEditPageComponent} from './page/post/edit';
import {RouterModule} from '@angular/router';
import {PagePageComponent} from './page/page/component';
import {ResumeListPageComponent} from './page/resume/list';
import {ResumeEditPageComponent} from './page/resume/edit';
import {UploadControlComponent} from './control/upload';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,

    MatExpansionModule,
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
    MatTabsModule,
    MatTableModule,
  ],
  declarations: [
    UploadControlComponent,
    DashboardPageComponent,
    LoginPageComponent,
    DefaultPage,
    PostListPageComponent,
    PostEditPageComponent,
    ResumeListPageComponent,
    ResumeEditPageComponent,
    PagePageComponent
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
  ]
})
export class ShellModule { }
