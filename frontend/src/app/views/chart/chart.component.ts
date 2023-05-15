import {
  AfterViewInit,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
const MATERIAL_MODULES = [
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
];

import { MeasurementCRUDModel } from '@/features/api-client';
import { I18N } from '@/features/i18n';

export type ChartComponentData = {
  measurement: MeasurementCRUDModel['getEntityResult'];
  substance_id?: number | undefined;
};

import Annotation from 'chartjs-plugin-annotation';
Chart.register(Annotation);

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-chart',
  template: `
    <div style="width: 1000px">
      <div
        class="p-3 display-flex align-items-center justify-content-space-between"
      >
        <div>
          {{
            I18N['Date'] + ': ' + (data.measurement.date | date : 'dd-MM-YYYY')
          }}
        </div>
        <mat-form-field>
          <mat-label>{{ I18N['Substance'] }}</mat-label>
          <mat-select
            [value]="substanceSelectValue"
            (selectionChange)="onSubstanceSelectionChange($event.value)"
          >
            <mat-option *ngFor="let entity of excesses" [value]="entity">
              {{ entity.chemical_element.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class="position-relative display-flex justify-content-center">
        <canvas id="chart-container"></canvas>
      </div>
    </div>
  `,
})
export class ChartComponent implements AfterViewInit {
  public I18N = I18N;
  public chart!: Chart<'line', number[], number>;
  public excesses!: MeasurementCRUDModel['getEntitiesResult']['measurements'];
  public substanceSelectValue!: MeasurementCRUDModel['getEntitiesResult']['measurements'][number];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ChartComponentData
  ) {}

  public ngAfterViewInit() {
    this.chart = new Chart('chart-container', {
      type: 'line',
      data: {
        datasets: [],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '',
            },
          },
          x: {
            title: {
              display: true,
              text: I18N['days before normalization'],
            },
          },
        },
      },
    });
    this.excesses = this.data.measurement.measurements.filter(
      (item) =>
        new Date() <
        new Date(
          new Date(this.data.measurement.date).getTime() +
            ((item.prediction_points.length || 1) - 1) * 24 * 60 * 60 * 1000
        )
    );
    if (this.data.substance_id) {
      this.substanceSelectValue = this.excesses.find(
        (item) => item.chemical_element.id === this.data.substance_id
      )!;
    } else {
      this.substanceSelectValue = this.excesses[0];
    }
    this.refreshChart(this.substanceSelectValue);
  }

  public onSubstanceSelectionChange(
    entity: MeasurementCRUDModel['getEntityResult']['measurements'][number]
  ) {
    this.refreshChart(entity);
  }

  private refreshChart(
    entity: MeasurementCRUDModel['getEntityResult']['measurements'][number]
  ) {
    if (entity) {
      entity.prediction_points.sort((a, b) => a.time - b.time);
      (this.chart.options.plugins as any).annotation = {
        annotations: {
          max_value: {
            type: 'line',
            label: {
              content: I18N['Max'],
              display: true,
              position: 'end',
            },
            yMin: entity.chemical_element.max_value,
            yMax: entity.chemical_element.max_value,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
          },
          min_value: {
            type: 'line',
            label: {
              content: I18N['Min'],
              display: true,
              position: 'start',
            },
            yMin: entity.chemical_element.min_value,
            yMax: entity.chemical_element.min_value,
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2,
          },
        },
      };
      this.chart.data = {
        labels: entity.prediction_points.map((item) => item.time),
        datasets: [
          {
            label: entity.chemical_element.name,
            data: entity.prediction_points.map((item) => item.value),
          },
        ],
      };
      this.chart.options.scales!['y']!.title!.text =
        entity.chemical_element.units;
    } else {
      this.chart.data = { datasets: [] };
      this.chart.options.scales!['y']!.title!.text = '';
    }
    this.chart.update();
  }
}
