import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";
import {AdminService} from "../../../shell/service/admin";

@Component({
  selector: 'dmn-root',
  templateUrl: './component.html',
  styleUrls: ['./component.sass']
})
export class AppComponent {
  title = 'admin';
  public isAuthecnticated_: Observable<boolean> = this.adminService.isAuthenticatedO;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private adminService: AdminService,
    private router: Router
  ) {}

  logout() {
    this.adminService.logout();
    this.router.navigate(['/']);
  }
}
