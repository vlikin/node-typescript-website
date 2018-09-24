import {Component, Inject} from '@angular/core';
import {AdminService} from '../../service/admin';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'dmn-shll-edit-post-dialog',
  styles: [],
  template: `
    <h2>Post item</h2>
    <div [formGroup]='form'>
      <div>
        <mat-form-field>
          <input type='text' matInput formControlName='link' placeholder='Link'>
        </mat-form-field>
      </div>
      <div>
        <mat-form-field>
          <input matInput [matDatepicker]='myDatepicker' formControlName='date'>
          <mat-datepicker-toggle matSuffix [for]='myDatepicker'></mat-datepicker-toggle>
          <mat-datepicker #myDatepicker></mat-datepicker>
        </mat-form-field>
      </div>
      <div formGroupName='translations'>
        <div formGroupName='en'>
          <h3>English</h3>
          <div>
            <mat-form-field>
              <input type='text' matInput formControlName='title' placeholder='title'>
            </mat-form-field>
          </div>
        </div>
        <div formGroupName='ru'>
          <h3>Russian</h3>
          <div>
            <mat-form-field>
              <input type='text' matInput formControlName='title' placeholder='title'>
            </mat-form-field>
          </div>
        </div>
        <div formGroupName='ua'>
          <h3>Ukrainian</h3>
          <div>
            <mat-form-field>
              <input type='text' matInput formControlName='title' placeholder='title'>
            </mat-form-field>
          </div>
        </div>
      </div>
    </div>
    <div>
      <button mat-button routerLink="/post/list">Cancel</button>
      <button mat-flat-button color='primary' (click)='save()' [disabled]='form.invalid || isProcessing'>
        {{ !item ? 'Create' : 'Save'}}
      </button>
      <button mat-flat-button color="warn" (click)="remove()" [disabled]="!item">Remove</button>
    </div>
  `
})
export class PostEditPageComponent {
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
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.adminService.adminPostGetHttp(params.get('_id'));
      })
    )
      .subscribe(({item}) => {
        this.item = item;
        this.form.patchValue(this.item);
      });
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
    } else {
      this.adminService.adminPostCreateHttp(this.form.getRawValue())
        .subscribe(({_id}) => {
          this.adminService.showMessage('The post message has been created successfully.');
          this.stopProcessing();
          this.item = this.form.getRawValue();
          this.item._id = _id;
        });
    }
  }

  remove() {
    this.startProcessing();
    this.adminService.adminPostDeleteHttp(this.item._id)
      .subscribe(() => {
        this.stopProcessing();
        this.router.navigate(['/post', 'list']);
      });
  }

  startProcessing() {
    this.isProcessing = true;
  }

  stopProcessing() {
    this.isProcessing = false;
  }
}
