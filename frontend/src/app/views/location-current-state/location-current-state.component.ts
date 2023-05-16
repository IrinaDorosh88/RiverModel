import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
const MATERIAL_MODULES = [MatButtonModule, MatIconModule, MatTableModule];

import {
  ApiClient,
  LocationCRUDModel,
  MeasurementCRUDModel,
} from '@/features/api-client';
import { I18N } from '@/features/i18n';
import { CallPipe } from '@/features/call-pipe';

export type LocationCurrentStateData = {
  location: LocationCRUDModel['getEntitiesResult'];
  measurement: MeasurementCRUDModel['getEntitiesResult'];
  excesses: MeasurementCRUDModel['getEntitiesResult']['measurements'];
};

export type LocationCurrentStateResult = number;

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ...MATERIAL_MODULES, CallPipe],
  selector: 'app-current-state',
  standalone: true,
  template: `
    <div class="p-3">
      <div class="p-2">
        {{ I18N['Location $name current state'] | call : data.location.name }}
      </div>
      <div class="p-2">
        {{
          I18N['Last measurement date: $date']
            | call : (data.measurement.date | date : 'dd-MM-YYYY')
        }}
      </div>
    </div>
    <table mat-table class="p-2" [dataSource]="dataSource">
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr
        *matRowDef="let item; columns: displayedColumns"
        class="cursor-pointer"
        mat-row
        (click)="onDisplayChartCLick(item.id)"
      ></tr>
      <ng-container matColumnDef="substance_name">
        <th *matHeaderCellDef mat-header-cell>{{ I18N['Substance'] }}</th>
        <td *matCellDef="let item" mat-cell>{{ item.substance_name }}</td>
      </ng-container>
      <ng-container matColumnDef="concentration_current_value">
        <th *matHeaderCellDef mat-header-cell>{{ I18N['Current value'] }}</th>
        <td *matCellDef="let item" mat-cell>
          {{ item.concentration_current_value }}
        </td>
      </ng-container>
      <ng-container matColumnDef="normalization_date">
        <th *matHeaderCellDef mat-header-cell>
          {{ I18N['Normalization date'] }}
        </th>
        <td *matCellDef="let item" mat-cell>
          {{ item.normalization_date | date : 'dd-MM-YYYY' }}
        </td>
      </ng-container>
    </table>
    <div class="p-2 f-size-2 text-align-center">
      {{ I18N['* Click on a substance to display the graph.'] }}
    </div>
  `,
})
export class LocationCurrentStateComponent implements OnInit {
  public readonly I18N = I18N;
  public readonly dataSource: MatTableDataSource<{
    id: number;
    substance_name: string;
    concentration_current_value: number;
    normalization_date: Date;
  }>;
  public readonly displayedColumns: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: LocationCurrentStateData,
    private readonly dialogRef: MatDialogRef<
      LocationCurrentStateComponent,
      LocationCurrentStateResult
    >
  ) {
    this.dataSource = new MatTableDataSource();
    this.displayedColumns = [
      'substance_name',
      'concentration_current_value',
      'normalization_date',
    ];
  }

  public ngOnInit() {
    const currentDate = new Date();
    const measurementDate = new Date(this.data.measurement.date);
    currentDate.setHours(0, 0, 0, 0);
    measurementDate.setHours(0, 0, 0, 0);
    const datesDiffInDays = Math.ceil(
      (currentDate.getTime() - measurementDate.getTime()) /
        (24 * 60 * 60 * 1000)
    );

    this.dataSource.data = this.data.excesses.map((item) => {
      item.prediction_points.sort((a, b) => a.time - b.time);
      return {
        id: item.chemical_element.id,
        substance_name: item.chemical_element.name,
        concentration_current_value:
          item.prediction_points[datesDiffInDays].value,
        normalization_date: new Date(
          measurementDate.getTime() +
            (item.prediction_points.length - 1) * 24 * 60 * 60 * 1000
        ),
      };
    });
  }

  public onDisplayChartCLick(id: number) {
    this.dialogRef.close(id);
  }
}
