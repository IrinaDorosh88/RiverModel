import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js/auto';

import { TOOLBAR_ACTION$$ } from '@app/views/home';
import { ApiClient, LocationCRUDModel } from '@app/features/api-client';

const MATERIAL_MODULES: any[] = [];

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-chart',
  template: `
    <div class="height-full p-5 display-flex flex-wrap gap-5 overflow-y-auto">
      <div class="card-box-shadow p-2 background-color-white" style="flex: 3;">
        <div
          class="height-full display-flex align-items-center justify-content-center"
        >
          <canvas id="chart-container"></canvas>
        </div>
      </div>
      <div class="card-box-shadow p-2 background-color-white" style="flex: 2;">
        <div
          class="height-full display-flex align-items-center justify-content-center"
          style="font-size: 2rem; color: white; background-color: blue"
        >
          Calculations HERE
        </div>
      </div>
    </div>
  `,
})
export class ChartComponent implements OnInit, AfterViewInit {
  private readonly SUBSCRIPTIONS;

  public CHART!: Chart<'bar', number[], string>;

  constructor(private apiClient: ApiClient) {
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

  public ngAfterViewInit() {
    this.CHART = new Chart('chart-container', {
      type: 'bar',
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
        ],
        datasets: [
          {
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
            ],
            borderWidth: 1,
          },
        ],
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

  public onLocationSelected(entity: LocationCRUDModel['getEntitiesResult']) {
    console.log(entity)
  }
}
