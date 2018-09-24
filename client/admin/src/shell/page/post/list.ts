import {Component} from '@angular/core';
import {AdminService} from '../../service/admin';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'dmn-post-list-page',
  template: `
    <mat-table [dataSource]='dataSource' class='mat-elevation-z8' fxFlexFill  >
      <ng-container matColumnDef='title'>
        <mat-header-cell mat-header-cell *matHeaderCellDef> Title </mat-header-cell>
        <mat-cell *matCellDef='let element'> {{element.translations.en.title }} </mat-cell>
      </ng-container>
      <ng-container matColumnDef='date'>
        <mat-header-cell *matHeaderCellDef> Date </mat-header-cell>
        <mat-cell *matCellDef='let element'> {{element.date | date:'short'}} </mat-cell>
      </ng-container>
      <ng-container matColumnDef='menu'>
        <mat-header-cell *matHeaderCellDef> Menu </mat-header-cell>
        <mat-cell *matCellDef='let element'>
          <button mat-icon-button [matMenuTriggerFor]='menu'>
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu='matMenu'>
            <a mat-menu-item [routerLink]="['/post/edit/', element._id]">
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
export class PostListPageComponent {
  displayedColumns: string[] = ['title',  'date', 'menu'];
  dataSource = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog
  ) {
    this.adminService.adminPostListHttp()
      .subscribe(({list}) => {
        this.dataSource = list;
      });
  }
}
