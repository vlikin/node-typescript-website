import {Component} from '@angular/core';
import {AdminService} from '../../service/admin';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'dmn-shll-edit-resume-dialog',
  styles: [`
  `],
  template: `
    <div class="dmn-form">
      <h2>Resume item</h2>
      <div [formGroup]="form">
        <div class="actions">
          <button mat-flat-button color="primary" [disabled]="form.invalid || isProcessing" (click)="save()">Save</button>
        </div>
        <div formGroupName="translations">
          <mat-tab-group>
            <mat-tab [label]="language.title" *ngFor="let language of languages">
              <div [formGroupName]="language.key" class="full-width-container">
                <mat-form-field>
                  <input type="text" matInput formControlName="position" placeholder="Position">
                </mat-form-field>
                <mat-form-field>
                  <input type="text" matInput formControlName="company" placeholder="Company">
                </mat-form-field>
                <mat-form-field>
                  <input type="text" matInput formControlName="period" placeholder="Period">
                </mat-form-field>
                <mat-form-field>
                  <input type="text" matInput formControlName="description" placeholder="Description">
                </mat-form-field>
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>
      </div>
    </div>
  `
})
export class ResumeEditPageComponent {
  public languages = this.adminService.languages;
  public isProcessing = false;
  public item;
  public form: FormGroup;

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form  = this.buildForm();
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.adminService.adminResumeGetHttp(params.get('_id'));
      })
    )
      .subscribe(({item}) => {
        this.item = item;
        this.form.patchValue(this.item);
      });
  }

  buildForm() {
    const translations = {};
    this.languages.forEach((language) => {
      translations[language.key] = this.fb.group({
        position: [''],
        company: [''],
        period: [''],
        description: ['']
      });
    });

    return this.fb.group({
      translations: this.fb.group(translations)
    });
  }

  save() {
    this.startProcessing();
    if (this.item) {
      const value = this.form.getRawValue();
      value._id = this.item._id;
      this.adminService.adminResumeSaveHttp(value)
        .subscribe(() => {
          this.adminService.showMessage('The resume has been saved.');
          this.stopProcessing();
        });
    } else {
      this.adminService.adminResumeCreateHttp(this.form.getRawValue())
        .subscribe(({_id}) => {
          this.adminService.showMessage('The resume message has been created successfully.');
          this.stopProcessing();
          this.item = this.form.getRawValue();
          this.item._id = _id;
        }, (error) => {
          this.stopProcessing();
          this.adminService.showMessage('Some error has occurred!', 'error');
        });
    }
  }

  remove() {
    this.startProcessing();
    this.adminService.adminResumeDeleteHttp(this.item._id)
      .subscribe(() => {
        this.stopProcessing();
        this.router.navigate(['/resume', 'list']);
      });
  }

  startProcessing() {
    this.isProcessing = true;
  }

  stopProcessing() {
    this.isProcessing = false;
  }
}
