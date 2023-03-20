import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';
const MATERIAL_MODULES = [MatTabsModule];

import { ChartComponent } from '@app/views/chart.component';
import { MapComponent } from '@app/views/map.component';
import { RiversAndSubstancesComponent } from '@app/views/rivers-and-substances.component';
const VIEWS = [ChartComponent, MapComponent, RiversAndSubstancesComponent];

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES, ...VIEWS],
  selector: 'app-home',
  template: `
    <mat-tab-group class="flex-auto">
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
  `,
})
export class HomeComponent {}
