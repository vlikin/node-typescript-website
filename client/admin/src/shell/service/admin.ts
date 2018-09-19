import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
import {mergeMap, tap} from "rxjs/operators";
import {MatSnackBar} from "@angular/material";

@Injectable({
  providedIn: 'root'
})
export class Admin {
  token: string;
  private isAuthenticateS: BehaviorSubject<boolean>;
  public isAuthenticatedO: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.token = this.readToken();
    this.isAuthenticateS = new BehaviorSubject<boolean>(this.isAuthenticated());
    this.isAuthenticatedO = this.isAuthenticateS.asObservable();
  }

  readToken(): string {
    return localStorage.getItem('token');
  }

  writeToken(token: string) {
    localStorage.setItem('token', token);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    this.isAuthenticateS.next(this.isAuthenticated());
  }

  public getToken() {
    return this.token;
  }

  public tryLogin(password: string, force=false): Observable<boolean> {
    if (!force && this.isAuthenticated()) return of(true);
    return this.http.post('/server/get-token', {password}).pipe(
      tap((data: {token?: string, message?: string}) => {
        this.login(data.token);
      }),
      mergeMap((data: {token?: string, message?: string}) => {
        return of(!!data.token);
      })
    );
  }

  public adminConfigHttp(): Observable<any> {
    return this.http.get('/server/admin/client-config');
  }

  login(token) {
    this.token = token;
    this.writeToken(token);
    this.isAuthenticateS.next(this.isAuthenticated());
  }

  public showMessage(message: string, action='info') {
    this.snackBar.open(message, action, {
      duration: 2000
    })
  }
}
