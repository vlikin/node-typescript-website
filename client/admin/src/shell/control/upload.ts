import {Component, forwardRef, Input} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {HttpEventType} from '@angular/common/http';
import {AdminService} from '../service/admin';

@Component({
  selector: 'app-shll-upload-control-component',
  template: `
    <div class='c-form-field'>
      <div class='placeholder'>{{ placeholder }}</div>
      <div *ngIf='value && !isToChange' class='view'>
        <span class='value'>{{ value }}</span>
        <button (click)='isToChange=true' mat-raised-button>Change</button>
      </div>
      <div *ngIf='!progress && (!value || isToChange)'>
        <input #file type='file' (change)='onChange($event)'/>
        <ng-container *ngIf='!progress && value'>
          <button (click)='isToChange=false' mat-raised-button>Cancel</button>
        </ng-container>
      </div>
      <div *ngIf='progress' class='progress'>{{ progress }}%</div>
      error
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadControlComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UploadControlComponent),
      multi: true,
    }
  ]
})
export class UploadControlComponent implements ControlValueAccessor, Validator {
  @Input() placeholder: string;
  public isToChange = false;
  public value: string;
  public progress: number;
  protected propagateChange = (a: any) => {
  };

  constructor(
    private adminService: AdminService
  ) {
  }

  public writeValue(_value: any) {
    this.value = _value;
  }

  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  public registerOnTouched() {
  }

  public onChange(event) {
    this.adminService.uploadFile(event.target.files[0])
      .subscribe(httpEvent => {
        if (httpEvent.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * httpEvent.loaded / httpEvent.total);
        } else if (httpEvent.type === HttpEventType.Response) {
          this.progress = null;
          this.writeValue(httpEvent.body['fileName']);
          this.propagateChange(this.value);
          this.isToChange = false;
        }
      });
  }

  registerOnValidatorChange(fn: () => void): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return undefined;
  }
}
