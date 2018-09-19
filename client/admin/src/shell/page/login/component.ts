import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Admin} from "../../service/admin";
import {Router} from "@angular/router";

@Component({
  selector: 'dmn-login-page',
  templateUrl: 'component.html',
  styleUrls: ['component.sass']
})
export class LoginPage implements OnInit {
  hide = true;
  isProcessing = false;

  form = new FormGroup({
    password: new FormControl('', Validators.required)
  });

  constructor(
    private router: Router,
    private adminService: Admin
  ) { }

  onSubmit() {
    this.isProcessing = true;
    this.adminService.tryLogin(this.form.value['password'])
      .subscribe(
        (isAuthenticated: boolean) => {
          if (isAuthenticated) {
            this.adminService.showMessage('The admin has been authenticated successfully!');
            this.router.navigate(['/dashboard']);
          }
          else {
            this.adminService.showMessage('Wrong authentication data', 'error');
          }
          this.isProcessing = false;
        },
        (error) => {
          console.log(error);
          this.isProcessing = false;
        }
      )
  }

  ngOnInit() {
  }

}
