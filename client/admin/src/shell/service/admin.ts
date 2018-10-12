import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {mergeMap, tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  token: string;
  languages = [
    {key: 'en', title: 'English'},
    {key: 'ru', title: 'Russian'},
    {key: 'uk', title: 'Ukrainian'},
  ];
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

  public tryLogin(password: string, force= false): Observable<boolean> {
    if (!force && this.isAuthenticated()) { return of(true); }
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

  public adminPageGetHttp(): Observable<any> {
    return this.http.get('/server/admin/page/get');
  }

  public adminPageSetHttp(state): Observable<any> {
    return this.http.post('/server/admin/page/set', {state});
  }

  public adminPostListHttp(): Observable<any> {
    return this.http.get('/server/admin/post/list');
  }

  public adminPostGetHttp(_id: string): Observable<any> {
    return this.http.post('/server/admin/post/get', {_id});
  }

  public adminPostDeleteHttp(_id: string): Observable<any> {
    return this.http.post('/server/admin/post/delete', {_id});
  }

  public adminPostCreateHttp(item): Observable<any> {
    return this.http.post('/server/admin/post/create', {item});
  }

  public adminPostSaveHttp(item): Observable<any> {
    return this.http.post('/server/admin/post/save', {item});
  }

  public adminResumeListHttp(): Observable<any> {
    return this.http.get('/server/admin/resume/list');
  }

  public adminResumeGetHttp(_id: string): Observable<any> {
    return this.http.post('/server/admin/resume/get', {_id});
  }

  public adminResumeDeleteHttp(_id: string): Observable<any> {
    return this.http.post('/server/admin/resume/delete', {_id});
  }

  public adminResumeCreateHttp(item): Observable<any> {
    return this.http.post('/server/admin/resume/create', {item});
  }

  public adminResumeSaveHttp(item): Observable<any> {
    return this.http.post('/server/admin/resume/save', {item});
  }

  public uploadFile(file): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('document', file);
    const uploadReq = new HttpRequest('POST', `/server/admin/upload-file`, formData, {
      reportProgress: true,
    });
    return this.http.request(uploadReq);
  }

  login(token) {
    this.token = token;
    this.writeToken(token);
    this.isAuthenticateS.next(this.isAuthenticated());
  }

  public showMessage(message: string, action= 'info') {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
}
