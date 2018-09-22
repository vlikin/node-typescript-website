import {Component} from '@angular/core';
import {AdminService} from '../../service/admin';
import {EditPostDialogComponent} from '../../dialog/edit-post';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'dmn-post-list-page',
  template: `
    <button mat-flat-button color="primary" (click)="newPost()">New</button>
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
            <button mat-menu-item (click)='openDialog(element._id)'>
              <mat-icon>edit</mat-icon>
              <span>Edit</span>
            </button>
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

  newPost() {
    this.openDialog();
  }

  openDialog(_id=null): void {
    const dialogRef = this.dialog.open(EditPostDialogComponent, {
      width: '600px',
      data: {_id}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //this.animal = result;
    });
  }
}
