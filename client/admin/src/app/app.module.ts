import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './component/app/component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ShellModule} from '../shell/shell.module';
import {
  MatFormFieldModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule
} from '@angular/material';
import {IsAuthenticatedGuard} from '../shell/is-authenticated.guard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ShellModule
  ],
  providers: [
    IsAuthenticatedGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
