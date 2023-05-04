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

import { SubstanceCRUDModel, ApiClient } from '@/features/api-client';
import { ConfirmationDialogService } from '@/features/confirmation-dialog';
import { NotificationService } from '@/features/notification';

import { TOOLBAR_ACTION$$ } from '@/views/home';

import {
  SubstanceFormComponent,
  SubstanceFormData,
} from './substance-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-substances',
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

      <ng-container matColumnDef="min">
        <th *matHeaderCellDef mat-header-cell>Min</th>
        <td *matCellDef="let item" mat-cell>{{ item.min }}</td>
      </ng-container>

      <ng-container matColumnDef="max">
        <th *matHeaderCellDef mat-header-cell>Max</th>
        <td *matCellDef="let item" mat-cell>{{ item.max }}</td>
      </ng-container>

      <ng-container matColumnDef="unit">
        <th *matHeaderCellDef mat-header-cell>Unit</th>
        <td *matCellDef="let item" mat-cell>{{ item.unit }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
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
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="DISPLAYED_COLUMNS"></tr>
      <tr mat-row *matRowDef="let row; columns: DISPLAYED_COLUMNS"></tr>
    </table>
  `,
})
export class SubstancesComponent implements OnInit, OnDestroy {
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
    private matDialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private apiClient: ApiClient
  ) {
    this.DISPLAYED_COLUMNS = ['name', 'min', 'max', 'unit', 'actions'];
    this.DATA_SOURCE = new MatTableDataSource<
      SubstanceCRUDModel['getPaginatedEntitiesResult']['data'][number]
    >([]);
    this.SUBSCRIPTIONS = new Subscription();
    this.paginationParams = { limit: 10 };
    this.length = 0;
  }

  public ngOnInit() {
    this.refreshEntities();

    this.SUBSCRIPTIONS.add(
      TOOLBAR_ACTION$$.subscribe({
        next: ({ key }) => {
          switch (key) {
            case 'SUBSTANCES_NEW_SUBSTANCE':
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
    item: SubstanceCRUDModel['getPaginatedEntitiesResult']['data'][number]
  ) {
    this.openDialog(item);
  }

  public onDeleteClick(
    item: SubstanceCRUDModel['getPaginatedEntitiesResult']['data'][number]
  ) {
    this.confirmationDialogService.open({
      title: `Delete ${item.name}`,
      confirmCallback: () => {
        return this.apiClient.substance.deleteEntity(item.id).pipe(
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
    data?: SubstanceCRUDModel['getPaginatedEntitiesResult']['data'][number]
  ) {
    this.matDialog
      .open<SubstanceFormComponent, SubstanceFormData, boolean>(
        SubstanceFormComponent,
        {
          width: '400px',
          data,
        }
      )
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
    this.apiClient.substance.getPaginatedEntities(this.params).subscribe({
      next: (next) => {
        this.length = next.count;
        this.DATA_SOURCE.data = next.data;
      },
    });
  }
}
