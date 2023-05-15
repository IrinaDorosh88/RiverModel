import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatTableModule,
];

import { ApiClient, LocationCRUDModel } from '@/features/api-client';
import { I18N } from '@/features/i18n';

import { HttpClientQueryParams } from '@/features/http-client-extensions';
import {
  MeasurementFormComponent,
  MeasurementFormData,
  MeasurementFormResult,
} from '@/views/measurement-form';
import { EMPTY, filter, switchMap, tap } from 'rxjs';
import { ExcessComponent, ExcessData, ExcessResult } from '../excess';
import { MatDialogRef } from '@angular/material/dialog';

export type MeasurementsTableData = {
  location: LocationCRUDModel['getEntitiesResult'];
};

export type MeasurementsTableResult = number;

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ExcessComponent,
    MeasurementFormComponent,
    ...MATERIAL_MODULES,
  ],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-measurements-table',
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
    <table mat-table class="p-3" [dataSource]="dataSource">
      <ng-container matColumnDef="date">
        <th *matHeaderCellDef mat-header-cell>{{ I18N['Date'] }}</th>
        <td *matCellDef="let item" mat-cell>
          {{ item.date | date : 'dd/MM/yyyy' }}
        </td>
      </ng-container>

      <ng-container matColumnDef="values">
        <th *matHeaderCellDef mat-header-cell>{{ I18N['Values'] }}</th>
        <td *matCellDef="let item" mat-cell>
          <div [innerHTML]="item.innerHTML"></div>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
})
export class MeasurementsTableComponent implements OnInit {
  public readonly I18N = I18N;
  public readonly dataSource: MatTableDataSource<{
    date: Date;
    innerHTML: string;
  }>;
  public readonly displayedColumns: string[];
  public readonly paginationParams: { limit: number; offset?: number };
  public readonly filtrationParams: NonNullable<HttpClientQueryParams>;
  public get params(): HttpClientQueryParams {
    return {
      ...this.filtrationParams,
      ...this.paginationParams,
    };
  }

  public length: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: MeasurementsTableData,
    private matDialog: MatDialog,
    private dialogRef: MatDialogRef<
      MeasurementsTableComponent,
      MeasurementsTableResult
    >,
    private apiClient: ApiClient
  ) {
    this.dataSource = new MatTableDataSource([] as any);
    this.displayedColumns = ['date', 'values'];
    this.paginationParams = { limit: 10 };
    this.filtrationParams = {};
    this.length = 0;
  }

  public ngOnInit() {
    if (this.data?.location.id) {
      this.filtrationParams['location_id'] = this.data.location.id;
    }
    this.refreshTable();
  }

  public onPaginatorPage(event: PageEvent) {
    if (event.pageIndex) {
      this.paginationParams.offset =
        event.pageIndex * this.paginationParams.limit;
    } else {
      delete this.paginationParams.offset;
    }
    this.refreshTable();
  }

  public onCreateClick() {
    return this.matDialog
      .open<
        MeasurementFormComponent,
        MeasurementFormData,
        MeasurementFormResult
      >(MeasurementFormComponent, {
        width: '400px',
        data: {
          location: this.data!.location,
        },
      })
      .afterClosed()
      .pipe(
        filter((next): next is MeasurementFormResult => !!next),
        tap(() => this.refreshTable()),
        switchMap((next) =>
          typeof next !== 'boolean'
            ? this.matDialog
                .open<ExcessComponent, ExcessData, ExcessResult>(
                  ExcessComponent,
                  {
                    width: '400px',
                    data: {
                      location: this.data.location,
                      excessed_substances: next,
                    },
                  }
                )
                .afterClosed()
            : EMPTY
        )
      )
      .subscribe({
        next: (next) => {
          if (next) {
            this.dialogRef.close(next);
          }
        },
      });
  }

  private refreshTable() {
    this.apiClient.measurement.getPaginatedEntities(this.params).subscribe({
      next: (next) => {
        this.length = next.total;
        this.dataSource.data = next.data.map((item) => ({
          date: item.date,
          innerHTML: item.measurements.reduce((accumulator, item) => {
            accumulator += `<div><b>${item.chemical_element.name}</b>: ${item.concentration_value}</div>`;
            return accumulator;
          }, ''),
        }));
      },
    });
  }
}
