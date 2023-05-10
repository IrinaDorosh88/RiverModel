import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
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

import { PredictionCRUDModel } from '@/features/api-client';
import { I18N } from '@/features/i18n';

export type ChartComponentData = {
  prediction: PredictionCRUDModel['getEntityResult'];
  substance_id?: number | undefined;
};

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-chart',
  template: `
    <div style="width: 1000px">
      <div mat-dialog-title style="padding-top: 1.5rem; text-align: end;">
        <mat-form-field>
          <mat-label>{{ I18N['Substance'] }}</mat-label>
          <mat-select
            [value]="substanceSelectValue"
            (selectionChange)="onSubstanceSelectionChange($event.value)"
          >
            <mat-option
              *ngFor="let entity of data.prediction.substances"
              [value]="entity"
            >
              {{ entity.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div mat-dialog-content class="display-flex justify-content-center">
        <canvas id="chart-container"></canvas>
      </div>
    </div>
  `,
})
export class ChartComponent implements AfterViewInit {
  public I18N = I18N;

  public chart!: Chart<'line', number[], number>;
  public substanceSelectValue!: PredictionCRUDModel['getEntityResult']['substances'][number];

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
              text: I18N['days'],
            },
          },
        },
      },
    });
    if (this.data.substance_id) {
      this.substanceSelectValue = this.data.prediction.substances.find(
        (item) => item.id === this.data.substance_id
      )!;
      this.refreshChart(this.substanceSelectValue);
    }
  }

  public onSubstanceSelectionChange(
    entity: PredictionCRUDModel['getEntityResult']['substances'][number]
  ) {
    this.refreshChart(entity);
  }

  private refreshChart(
    entity: PredictionCRUDModel['getEntityResult']['substances'][number]
  ) {
    if (entity) {
      this.chart.data.labels = entity.values.map((value) => value.x);
      this.chart.data.datasets = [
        { label: entity.name, data: entity.values.map((value) => value.y) },
      ];
      this.chart.options.scales!['y']!.title!.text = entity.unit;
    } else {
      this.chart.data = { datasets: [] };
      this.chart.options.scales!['y']!.title!.text = '';
    }
    this.chart.update();
  }
}
