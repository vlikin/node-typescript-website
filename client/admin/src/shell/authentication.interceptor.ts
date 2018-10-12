import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AdminService} from './service/admin';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(
    private adminService: AdminService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.adminService.isAuthenticated()) {
      return next.handle(req);
    }
    const token = this.adminService.getToken();
    const headers = req.headers.set('Authentication', 'bearer ' + token);
    const authenticationRequest = req.clone({headers});

    return next.handle(authenticationRequest);
  }
}
