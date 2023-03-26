import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';
const MATERIAL_MODULES = [MatTabsModule];

import { ToolbarComponent } from '@app/views/toolbar';
import { ChartComponent } from '@app/views/chart';
import { MapComponent } from '@app/views/map';
import { RiversAndSubstancesComponent } from '@app/views/rivers-and-substances';
const VIEWS = [
  ToolbarComponent,
  ChartComponent,
  MapComponent,
  RiversAndSubstancesComponent,
];

import { HOME_CURRENT_TAB$$ } from './home.model';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES, ...VIEWS],
  selector: 'app-home',
  template: `
    <div class="height-full display-flex flex-direction-column">
      <app-toolbar></app-toolbar>

      <mat-tab-group
        class="flex-auto"
        (selectedIndexChange)="onTabSelectedIndexChange($event)"
      >
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
  public onTabSelectedIndexChange(index: number) {
    HOME_CURRENT_TAB$$.next(index);
  }
}
