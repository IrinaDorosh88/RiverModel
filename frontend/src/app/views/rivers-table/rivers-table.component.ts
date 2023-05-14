import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription, tap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatTableModule,
];

import { ApiClient, RiverCRUDModel } from '@/features/api-client';
import { ConfirmationDialogService } from '@/features/confirmation-dialog';
import { I18N } from '@/features/i18n';
import { NotificationService } from '@/features/notification';

import { RiverFormComponent, RiverFormData } from '@/views/river-form';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-rivers-table',
  template: `
    <div
      class="p-3 display-flex align-items-center justify-content-space-between"
    >
      <button
        mat-mini-fab
        class="color-white background-color-primary"
        (click)="onCreateClick()"
      >
        <mat-icon>add</mat-icon>
      </button>
      <mat-paginator
        [length]="length"
        [hidePageSize]="true"
        [pageSize]="10"
        [showFirstLastButtons]="true"
        (page)="onPaginatorPage($event)"
      ></mat-paginator>
    </div>
    <table mat-table class="p-2" [dataSource]="dataSource">
      <ng-container matColumnDef="name">
        <th *matHeaderCellDef mat-header-cell>{{ I18N['Name'] }}</th>
        <td *matCellDef="let item" mat-cell>{{ item.name }}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th *matHeaderCellDef mat-header-cell style="width: 96px"></th>
        <td *matCellDef="let item" mat-cell>
          <div class="display-flex g-2">
            <button
              mat-mini-fab
              class="color-white background-color-accent"
              (click)="onEditClick(item)"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-mini-fab
              class="color-white background-color-warn"
              (click)="onDeleteClick(item)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
})
export class RiversTableComponent implements OnInit {
  public readonly I18N = I18N;
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  private readonly subscriptions: Subscription;
  public readonly dataSource: MatTableDataSource<
    RiverCRUDModel['getPaginatedEntitiesResult']
  >;
  public readonly displayedColumns: string[];
  public readonly params: { limit: number; offset?: number };
  private dialogCloseResult: boolean;
  public length: number;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly dialogRef: MatDialogRef<RiversTableComponent>,
    private readonly apiClient: ApiClient,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly notificationService: NotificationService
  ) {
    this.subscriptions = new Subscription();
    this.dataSource = new MatTableDataSource([] as any);
    this.displayedColumns = ['name', 'actions'];
    this.params = { limit: 10 };
    this.dialogCloseResult = false;
    this.length = 0;
  }

  public ngOnInit() {
    this.dialogRef.disableClose = true;
    this.subscriptions.add(
      this.dialogRef.backdropClick().subscribe({
        next: () => this.dialogRef.close(this.dialogCloseResult),
      })
    );
    this.refreshEntities();
  }

  public onPaginatorPage(event: PageEvent) {
    if (event.pageIndex) {
      this.params['offset'] = event.pageIndex * this.params['limit'];
    } else {
      delete this.params['offset'];
    }
    this.refreshEntities();
  }

  public onCreateClick() {
    this.openDialog();
  }

  public onDeleteClick(item: RiverCRUDModel['getPaginatedEntitiesResult']) {
    this.confirmationDialogService.open({
      title: I18N['Delete $name river'](item.name),
      confirmCallback: () => {
        return this.apiClient.river.deleteEntity(item.id).pipe(
          tap(() => {
            this.notificationService.notify(
              I18N['$name river is successfully deleted.'](item.name)
            );
            if (!this.dataSource.data.length && this.params.offset) {
              this.paginator.previousPage();
            } else {
              this.refreshEntities();
            }
            this.dialogCloseResult = true;
          })
        );
      },
    });
  }

  public onEditClick(item: RiverCRUDModel['getPaginatedEntitiesResult']) {
    this.openDialog(item);
  }

  private openDialog(data?: RiverCRUDModel['getPaginatedEntitiesResult']) {
    this.matDialog
      .open<RiverFormComponent, RiverFormData, boolean>(RiverFormComponent, {
        width: '400px',
        data,
      })
      .afterClosed()
      .subscribe({
        next: (next) => {
          if (next) {
            this.refreshEntities();
            this.dialogCloseResult = true;
          }
        },
      });
  }

  private refreshEntities() {
    this.apiClient.river.getPaginatedEntities(this.params).subscribe({
      next: (next) => {
        this.length = next.total;
        this.dataSource.data = next.data;
      },
    });
  }
}
