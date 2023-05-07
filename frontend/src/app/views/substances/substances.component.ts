import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
import { I18N } from '@/features/i18n';
import { NotificationService } from '@/features/notification';

import {
  SubstanceFormComponent,
  SubstanceFormData,
} from '@/views/substance-form';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-substances',
  template: `
    <div
      class="p-2 display-flex align-items-center justify-content-space-between"
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
    <table mat-table class="p-2" [dataSource]="DATA_SOURCE">
      <ng-container matColumnDef="actions">
        <th *matHeaderCellDef mat-header-cell style="width: 96px"></th>
        <td *matCellDef="let item" mat-cell>
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
        </td>
      </ng-container>
      <ng-container matColumnDef="name">
        <th *matHeaderCellDef mat-header-cell>{{ I18N['Name'] }}</th>
        <td *matCellDef="let item" mat-cell>{{ item.name }}</td>
      </ng-container>
      <ng-container matColumnDef="max_value">
        <th *matHeaderCellDef mat-header-cell>{{ I18N['Max'] }}</th>
        <td *matCellDef="let item" mat-cell>{{ item.max_value }}</td>
      </ng-container>
      <ng-container matColumnDef="min_value">
        <th *matHeaderCellDef mat-header-cell>{{ I18N['Min'] }}</th>
        <td *matCellDef="let item" mat-cell>{{ item.min_value }}</td>
      </ng-container>
      <ng-container matColumnDef="units">
        <th *matHeaderCellDef mat-header-cell>{{ I18N['Unit'] }}</th>
        <td *matCellDef="let item" mat-cell>{{ item.units }}</td>
      </ng-container>
      <ng-container matColumnDef="timedelta_decay">
        <th *matHeaderCellDef mat-header-cell>
          {{ I18N['Time delta decay'] }}
        </th>
        <td *matCellDef="let item" mat-cell>{{ item.timedelta_decay }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="DISPLAYED_COLUMNS"></tr>
      <tr mat-row *matRowDef="let row; columns: DISPLAYED_COLUMNS"></tr>
    </table>
  `,
})
export class SubstancesComponent implements OnInit {
  public readonly I18N = I18N;
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
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
    this.DISPLAYED_COLUMNS = [
      'name',
      'min_value',
      'max_value',
      'units',
      'timedelta_decay',
      'actions',
    ];
    this.DATA_SOURCE = new MatTableDataSource<
      SubstanceCRUDModel['getPaginatedEntitiesResult']['data'][number]
    >([]);
    this.paginationParams = { limit: 10 };
    this.length = 0;
  }

  public ngOnInit() {
    this.refreshEntities();
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

  public onCreateClick() {
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
      title: I18N['Delete $name substance'](item.name),
      confirmCallback: () => {
        return this.apiClient.substance.deleteEntity(item.id).pipe(
          tap(() => {
            this.notificationService.notify(
              I18N['$name substance is successfully deleted.'](item.name)
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
