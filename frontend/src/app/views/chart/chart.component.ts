import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { Chart } from 'chart.js/auto';

import { MatTableModule } from '@angular/material/table';
const MATERIAL_MODULES = [MatTableModule];

import { ApiClient, PredictionCRUDModel } from '@/features/api-client';

import { TOOLBAR_ACTION$$ } from '@/views/home';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-chart',
  template: `
    <div class="home-content app-card-container">
      <div
        class="app-card display-flex align-items-center justify-content-center"
        style="flex: 3;"
      >
        <canvas id="chart-container"></canvas>
      </div>
      <div class="app-card" style="flex: 2;">
        <ng-template
          [ngIf]="PREDICTION$$ | async"
          [ngIfElse]="noData"
          let-dataSource
        >
          <table mat-table class="p-3" [dataSource]="dataSource">
            <!-- name -->
            <ng-container matColumnDef="name">
              <th *matHeaderCellDef mat-header-cell>Name</th>
              <td *matCellDef="let item" mat-cell>
                {{ item.name }}
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="DISPLAYED_COLUMNS"></tr>
            <tr
              *matRowDef="let row; columns: DISPLAYED_COLUMNS"
              mat-row
              class="cursor-pointer"
              (click)="onSubstanceClick(row)"
            ></tr>
          </table>
        </ng-template>
        <ng-template #noData>
          <div
            class="display-flex align-items-center justify-content-center"
            style="height: 100%"
          >
            Choose location to display Data
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
  public readonly DISPLAYED_COLUMNS;
  public readonly PREDICTION$$;
  private readonly SUBSCRIPTIONS;

  public CHART!: Chart<'line', number[], number>;

  constructor(private apiClient: ApiClient) {
    this.PREDICTION$$ = new Subject<
      PredictionCRUDModel['getEntityByLocationIdResult']['substances'] | null
    >();
    this.DISPLAYED_COLUMNS = ['name'];
    this.SUBSCRIPTIONS = new Subscription();
  }

  public ngOnInit() {
    this.SUBSCRIPTIONS.add(
      TOOLBAR_ACTION$$.subscribe({
        next: ({ key, params }) => {
          switch (key) {
            case 'CHART_LOCATION_SELECTED':
              this.onLocationSelected(params[0]);
              break;
          }
        },
      })
    );
  }

  public ngOnDestroy() {
    this.SUBSCRIPTIONS.unsubscribe();
  }

  public ngAfterViewInit() {
    this.CHART = new Chart('chart-container', {
      type: 'line',
      // data: {
      //   labels: [
      //     'January',
      //     'February',
      //     'March',
      //     'April',
      //     'May',
      //   ],
      //   datasets: [
      //     {
      //       label: 'My First Dataset',
      //       data: [65, 59, 80, 81, 56],
      //       backgroundColor: [
      //         'rgba(255, 99, 132, 0.2)',
      //         'rgba(255, 159, 64, 0.2)',
      //         'rgba(255, 205, 86, 0.2)',
      //         'rgba(75, 192, 192, 0.2)',
      //         'rgba(54, 162, 235, 0.2)',
      //       ],
      //       borderColor: [
      //         'rgb(255, 99, 132)',
      //         'rgb(255, 159, 64)',
      //         'rgb(255, 205, 86)',
      //         'rgb(75, 192, 192)',
      //         'rgb(54, 162, 235)',
      //       ],
      //       borderWidth: 1,
      //     },
      //   ],
      // },
      data: {
        datasets: [],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  public onSubstanceClick(
    entity: PredictionCRUDModel['getEntityByLocationIdResult']['substances'][number]
  ) {
    this.refreshChart(entity);
  }

  private onLocationSelected(id: number | null) {
    if (id) {
      this.apiClient.prediction.getEntityByLocationId(id).subscribe({
        next: (next) => {
          this.PREDICTION$$.next(next.substances);
        },
      });
    } else {
      this.PREDICTION$$.next(null);
      this.refreshChart(null);
    }
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
    } else {
      this.CHART.data = { datasets: [] };
    }
    this.CHART.update();
  }
}
