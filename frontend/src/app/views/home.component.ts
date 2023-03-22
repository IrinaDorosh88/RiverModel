import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatTabsModule,
  MatToolbarModule,
];

import { ChartComponent } from '@app/views/chart.component';
import { MapComponent } from '@app/views/map.component';
import { RiversAndSubstancesComponent } from '@app/views/rivers-and-substances.component';

const VIEWS = [ChartComponent, MapComponent, RiversAndSubstancesComponent];

export const HOME_TOOLBAR_ACTION$$ = new Subject<{
  key: string;
  params: any[];
}>();

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES, ...VIEWS],
  selector: 'app-home',
  template: `
    <div class="height-full display-flex flex-direction-column">
      <div class="p-3 display-flex gap-2" [ngSwitch]="selectedTabIndex">
        <ng-container *ngSwitchCase="0">
          <button
            mat-mini-fab
            color="primary"
            style="border-radius: 1rem;"
            (click)="onToolbarActionInvoked('CREATE')"
          >
            <mat-icon>add</mat-icon>
          </button>
        </ng-container>
        <ng-container *ngSwitchCase="1">
          <button
            mat-mini-fab
            color="accent"
            style="border-radius: 1rem;"
            (click)="onToolbarActionInvoked('CREATE')"
          >
            <mat-icon>add</mat-icon>
          </button>
        </ng-container>
        <ng-container *ngSwitchCase="2">
          <button
            mat-mini-fab
            color="warn"
            style="border-radius: 1rem;"
            (click)="onToolbarActionInvoked('CREATE')"
          >
            <mat-icon>add</mat-icon>
          </button>
        </ng-container>
      </div>

      <mat-tab-group class="flex-auto" [(selectedIndex)]="selectedTabIndex">
        <mat-tab label="Rivers & Substances">
          <ng-template matTabContent>
            <app-rivers-and-substances></app-rivers-and-substances>
          </ng-template>
        </mat-tab>
        <mat-tab label="Map">
          <ng-template matTabContent>
            <app-map></app-map>
          </ng-template>
        </mat-tab>
        <mat-tab label="Chart">
          <ng-template matTabContent>
            <app-chart></app-chart>
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class HomeComponent {
  public selectedTabIndex = 0;

  public onToolbarActionInvoked(key: string, ...params: any[]) {
    HOME_TOOLBAR_ACTION$$.next({ key, params });
  }
}
