import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription, tap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
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
import { HttpClientQueryParams } from '@/features/http-client-extensions';

export type MeasurementsData = {
  location_id?: number;
};

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-substances',
  template: `
    <mat-paginator
      [length]="length"
      [hidePageSize]="true"
      [pageSize]="10"
      [showFirstLastButtons]="true"
      (page)="onPaginatorPage($event)"
    ></mat-paginator>
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
    @Optional() @Inject(MAT_DIALOG_DATA) private data: MeasurementsData | null,
    private apiClient: ApiClient
  ) {
    this.dataSource = new MatTableDataSource([] as any);
    this.displayedColumns = ['date', 'values'];
    this.paginationParams = { limit: 10 };
    this.filtrationParams = {};
    this.length = 0;
  }

  public ngOnInit() {
    if (this.data?.location_id) {
      this.filtrationParams['location_id'] = this.data.location_id;
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

  private refreshTable() {
    this.apiClient.measurement.getPaginatedEntities(this.params).subscribe({
      next: (next) => {
        // this.length = next.total;
        // this.dataSource.data = next.data.map((item) => ({
        //   date: item.date,
        //   innerHTML: item.values.reduce((accumulator: any, item: any) => {
        //     accumulator += `<div><b>${item.substance_name}</b>: ${item.value}</div>`;
        //     return accumulator;
        //   }, ''),
        // }));
        console.log(next)
      },
    });
  }
}
