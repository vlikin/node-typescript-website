import {Component} from '@angular/core';
import {AdminService} from '../../service/admin';

@Component({
  selector: 'dmn-resume-list-page',
  template: `
    <mat-table [dataSource]='dataSource' class='mat-elevation-z8' fxFlexFill  >
      <ng-container matColumnDef='position'>
        <mat-header-cell mat-header-cell *matHeaderCellDef> Position </mat-header-cell>
        <mat-cell *matCellDef='let element'> {{element.translations.en.position }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef='company'>
        <mat-header-cell mat-header-cell *matHeaderCellDef> Company </mat-header-cell>
        <mat-cell *matCellDef='let element'> {{element.translations.en.company }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef='period'>
        <mat-header-cell mat-header-cell *matHeaderCellDef> Period </mat-header-cell>
        <mat-cell *matCellDef='let element'> {{element.translations.en.period }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef='menu'>
        <mat-header-cell *matHeaderCellDef> Menu </mat-header-cell>
        <mat-cell *matCellDef='let element'>
          <button mat-icon-button [matMenuTriggerFor]='menu'>
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu='matMenu'>
            <a mat-menu-item [routerLink]="['/resume/edit/', element._id]">
              <mat-icon>edit</mat-icon>
              <span>Edit</span>
            </a>
          </mat-menu>
        </mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef='displayedColumns'></mat-header-row>
      <mat-row *matRowDef='let row; columns: displayedColumns;'></mat-row>
    </mat-table>
  `,
  styles: [
  ]
})
export class ResumeListPageComponent {
  displayedColumns: string[] = ['position',  'company', 'period', 'menu'];
  dataSource = [];

  constructor(
    private adminService: AdminService
  ) {
    this.adminService.adminResumeListHttp()
      .subscribe(({list}) => {
        this.dataSource = list;
      });
  }
}
