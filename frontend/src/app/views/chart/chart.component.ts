import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
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

import { ApiClient, PredictionCRUDModel } from '@/features/api-client';
import { I18N } from '@/features/i18n';

export type ChartComponentData = {
  location_id: number;
  substance_id?: number | undefined;
};

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-chart',
  template: `
    <div mat-dialog-title style="padding-top: 1.5rem; text-align: end;">
      <mat-form-field>
        <mat-label>{{ I18N['Substance'] }}</mat-label>
        <mat-select
          [value]="data.substance_id"
          (selectionChange)="onSubstanceSelectionChange($event.value)"
        >
          <mat-option [value]="null">---</mat-option>
          <mat-option
            *ngFor="let entity of SUBSTANCES$ | async"
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
  `,
})
export class ChartComponent implements OnInit, AfterViewInit {
  public I18N = I18N;
  public SUBSTANCES$!: Observable<
    PredictionCRUDModel['getEntityByLocationIdResult']['substances']
  >;
  public CHART!: Chart<'line', number[], number>;

  constructor(
    private apiClient: ApiClient,
    @Inject(MAT_DIALOG_DATA)
    public data: ChartComponentData
  ) {}

  public ngOnInit() {
    this.SUBSTANCES$ = this.apiClient.prediction
      .getEntityByLocationId(this.data.location_id)
      .pipe(map((next) => next.substances));
  }

  public ngAfterViewInit() {
    this.CHART = new Chart('chart-container', {
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
  }

  public onSubstanceSelectionChange(
    entity:
      | PredictionCRUDModel['getEntityByLocationIdResult']['substances'][number]
      | null
  ) {
    this.refreshChart(entity);
  }

  private refreshChart(
    entity:
      | PredictionCRUDModel['getEntityByLocationIdResult']['substances'][number]
      | null
  ) {
    if (entity) {
      this.CHART.data.labels = entity.values.map((value) => value.x);
      this.CHART.data.datasets = [
        { label: entity.name, data: entity.values.map((value) => value.y) },
      ];
      this.CHART.options.scales!['y']!.title!.text = entity.unit;
    } else {
      this.CHART.data = { datasets: [] };
      this.CHART.options.scales!['y']!.title!.text = '';
    }
    this.CHART.update();
  }
}
