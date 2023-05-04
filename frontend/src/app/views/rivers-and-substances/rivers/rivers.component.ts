import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, tap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
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
import { NotificationService } from '@/features/notification';

import { TOOLBAR_ACTION$$ } from '@/views/home';

import { RiverFormComponent, RiverFormData } from './river-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-rivers',
  template: `
    <mat-paginator
      [length]="length"
      [hidePageSize]="true"
      [pageSize]="10"
      [showFirstLastButtons]="true"
      (page)="onPaginatorPage($event)"
    ></mat-paginator>
    <table mat-table class="p-2" [dataSource]="DATA_SOURCE">
      <ng-container matColumnDef="name">
        <th *matHeaderCellDef mat-header-cell>Name</th>
        <td *matCellDef="let item" mat-cell>{{ item.name }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th *matHeaderCellDef mat-header-cell style="width: 48px"></th>
        <td *matCellDef="let item" mat-cell>
          <div class="display-flex gap-2">
            <button mat-mini-fab color="accent" (click)="onEditClick(item)">
              <mat-icon>edit</mat-icon>
            </button>
          </div>
        </td>
      </ng-container>
      <!-- <ng-container matColumnDef="actions">
        <th *matHeaderCellDef mat-header-cell style="width: 96px"></th>
        <td *matCellDef="let item" mat-cell>
          <div class="display-flex gap-2">
            <button mat-mini-fab color="accent" (click)="onEditClick(item)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-mini-fab color="warn" (click)="onDeleteClick(item)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </td>
      </ng-container> -->

      <tr mat-header-row *matHeaderRowDef="DISPLAYED_COLUMNS"></tr>
      <tr mat-row *matRowDef="let row; columns: DISPLAYED_COLUMNS"></tr>
    </table>
  `,
})
export class RiversComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  private readonly SUBSCRIPTIONS;
  public readonly DISPLAYED_COLUMNS;
  public readonly DATA_SOURCE;
  public readonly paginationParams: { limit: number; offset?: number };
  public length;
  private get params() {
    return this.paginationParams;
  }

  constructor(
    private readonly matDialog: MatDialog,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly notificationService: NotificationService,
    private readonly apiClient: ApiClient
  ) {
    this.SUBSCRIPTIONS = new Subscription();
    this.DISPLAYED_COLUMNS = ['name', 'actions'];
    this.DATA_SOURCE = new MatTableDataSource<
      RiverCRUDModel['getPaginatedEntitiesResult']['data'][number]
    >([]);
    this.paginationParams = { limit: 10 };
    this.length = 0;
  }

  public ngOnInit() {
    this.refreshEntities();

    this.SUBSCRIPTIONS.add(
      TOOLBAR_ACTION$$.subscribe({
        next: ({ key }) => {
          switch (key) {
            case 'RIVERS_NEW_RIVER':
              this.onCreateClick();
              break;
          }
        },
      })
    );
  }

  public ngOnDestroy() {
    this.SUBSCRIPTIONS.unsubscribe();
  }

  public onPaginatorPage(event: PageEvent) {
    if (event.pageIndex) {
      this.paginationParams.offset =
        event.pageIndex * this.paginationParams.limit;
    } else {
      delete this.paginationParams.offset;
    }
    this.refreshEntities();
  }

  private onCreateClick() {
    this.openDialog();
  }

  public onEditClick(
    item: RiverCRUDModel['getPaginatedEntitiesResult']['data'][number]
  ) {
    this.openDialog(item);
  }

  public onDeleteClick(
    item: RiverCRUDModel['getPaginatedEntitiesResult']['data'][number]
  ) {
    this.confirmationDialogService.open({
      title: `Delete ${item.name}`,
      confirmCallback: () => {
        return this.apiClient.river.deleteEntity(item.id).pipe(
          tap(() => {
            this.notificationService.notify(
              `${item.name} is successfully deleted!`
            );
            if (!this.DATA_SOURCE.data.length && this.paginationParams.offset) {
              this.paginator.previousPage();
            } else {
              this.refreshEntities();
            }
          })
        );
      },
    });
  }

  private openDialog(
    data?: RiverCRUDModel['getPaginatedEntitiesResult']['data'][number]
  ) {
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
          }
        },
      });
  }

  private refreshEntities() {
    this.apiClient.river.getPaginatedEntities(this.params).subscribe({
      next: (next) => {
        this.length = next.count;
        this.DATA_SOURCE.data = next.data;
      },
    });
  }
}
