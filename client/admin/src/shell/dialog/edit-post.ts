import {Component, Inject, Injectable} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {AdminService} from '../service/admin';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'dmn-shll-edit-post-dialog',
  styles: [],
  template: `
    <h2 mat-dialog-title>Post item</h2>
    <mat-dialog-content>
      <form [formGroup]="form" fxLayout="column" fxFlexFill>
        <mat-form-field>
          <input type="text" matInput formControlName="link" placeholder="Link">
        </mat-form-field>
        <mat-form-field>
          <input matInput [matDatepicker]="myDatepicker" formControlName="date">
          <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
          <mat-datepicker #myDatepicker></mat-datepicker>
        </mat-form-field>

        <ng-container formGroupName="translations">
          <mat-card formGroupName="en">
            <mat-card-title>English</mat-card-title>
            <mat-card-content fxLayout="column">
              <mat-form-field>
                <input type="text" matInput formControlName="title" placeholder="title">
              </mat-form-field>
            </mat-card-content>
          </mat-card>
          <mat-divider></mat-divider>
          <mat-card formGroupName="ru">
            <mat-card-title>Russian</mat-card-title>
            <mat-card-content fxLayout="column">
              <mat-form-field>
                <input type="text" matInput formControlName="title" placeholder="title">
              </mat-form-field>
            </mat-card-content>
          </mat-card>
          <mat-divider></mat-divider>
          <mat-card formGroupName="ua">
            <mat-card-title>Ukrainian</mat-card-title>
            <mat-card-content fxLayout="column">
              <mat-form-field>
                <input type="text" matInput formControlName="title" placeholder="title">
              </mat-form-field>
            </mat-card-content>
          </mat-card>
        </ng-container>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <div fxLayout="row" fxLayoutAlign="end center" fxFlexFill>
        <button mat-button mat-dialog-close [mat-dialog-close]="true">Cancel</button>
        <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid || isProcessing">
          {{ !item ? 'Create' : 'Save'}}
        </button>
      </div>
    </mat-dialog-actions>
  `
})
export class EditPostDialogComponent {
  public isProcessing = false;
  public item;
  public form = new FormGroup({
    link: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    translations: new FormGroup({
      en: new FormGroup({
        title: new FormControl('', Validators.required)
      }),
      ru: new FormGroup({
        title: new FormControl('', Validators.required)
      }),
      ua: new FormGroup({
        title: new FormControl('', Validators.required)
      }),
    })
  });

  constructor(
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    if (data._id) {
      this.adminService.adminPostGetHttp(data._id)
        .subscribe(({item}) => {
          this.item = item;
          this.form.patchValue(this.item);
          console.log(this.item, this.form.value);
        });
    }
  }

  save() {
    this.startProcessing();
    if (this.item) {
      const value = this.form.getRawValue();
      value._id = this.item._id;
      this.adminService.adminPostSaveHttp(value)
        .subscribe(() => {
          this.adminService.showMessage('The post has been saved.');
          this.stopProcessing();
        });
    }
    else {
      this.adminService.adminPostCreateHttp(this.form.getRawValue())
        .subscribe(({_id}) => {
          this.adminService.showMessage('The post message has been created successfully.');
          this.stopProcessing();
          this.item = this.form.getRawValue();
          this.item._id = _id;
          console.log(_id);
        });
    }
  }

  startProcessing () {
    this.isProcessing = true;
  }

  stopProcessing () {
    this.isProcessing = false;
  }
}
