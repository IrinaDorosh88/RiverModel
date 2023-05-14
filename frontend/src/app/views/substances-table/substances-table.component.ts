import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { tap } from 'rxjs';

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
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
})
export class SubstancesTableComponent implements OnInit {
  public readonly I18N = I18N;
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  public readonly dataSource: MatTableDataSource<
    SubstanceCRUDModel['getPaginatedEntitiesResult']
  >;
  public readonly displayedColumns: string[];
  public readonly params: { limit: number; offset?: number };
  public length: number;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly apiClient: ApiClient,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly notificationService: NotificationService
  ) {
    this.dataSource = new MatTableDataSource([] as any);
    this.displayedColumns = [
      'name',
      'min_value',
      'max_value',
      'units',
      'timedelta_decay',
      'actions',
    ];
    this.params = { limit: 10 };
    this.length = 0;
  }

  public ngOnInit() {
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

  public onDeleteClick(item: SubstanceCRUDModel['getPaginatedEntitiesResult']) {
    this.confirmationDialogService.open({
      title: I18N['Delete $name substance'](item.name),
      confirmCallback: () => {
        return this.apiClient.substance.deleteEntity(item.id).pipe(
          tap(() => {
            this.notificationService.notify(
              I18N['$name substance is successfully deleted.'](item.name)
            );
            if (!this.dataSource.data.length && this.params['offset']) {
              this.paginator.previousPage();
            } else {
              this.refreshEntities();
            }
          })
        );
      },
    });
  }

  public onEditClick(item: SubstanceCRUDModel['getPaginatedEntitiesResult']) {
    this.openDialog(item);
  }

  private openDialog(data?: SubstanceCRUDModel['getPaginatedEntitiesResult']) {
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
        this.length = next.total;
        this.dataSource.data = next.data;
      },
    });
  }
}
