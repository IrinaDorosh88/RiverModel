import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, BehaviorSubject, startWith } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatSelectModule,
  MatTabsModule,
  MatToolbarModule,
];

import { RiverCRUDModel, ApiClient, LocationCRUDModel } from '@app/features/api-client';

import { ChartComponent } from '@app/views/chart';
import { MapComponent } from '@app/views/map';
import { RiversAndSubstancesComponent } from '@app/views/rivers-and-substances';
const VIEWS = [ChartComponent, MapComponent, RiversAndSubstancesComponent];

import { LocationFilterComponent } from './location-filter.component';

export const TOOLBAR_ACTION$$ = new Subject<{
  key: string;
  params: any[];
}>();

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES, ...VIEWS, LocationFilterComponent],
  selector: 'app-home',
  template: `
    <div class="height-full display-flex flex-direction-column">
      <div
        class="p-3 display-flex align-items-center gap-2"
        style="min-height: 7rem"
        [ngSwitch]="tabGroupSelectedIndex"
      >
        <ng-template [ngSwitchCase]="0">
          <button
            mat-flat-button
            color="primary"
            (click)="onToolbarActionInvoked('RIVERS_NEW_RIVER')"
          >
            <mat-icon>add</mat-icon>
            River
          </button>
          <button
            mat-flat-button
            color="primary"
            (click)="onToolbarActionInvoked('SUBSTANCES_NEW_SUBSTANCE')"
          >
            <mat-icon>add</mat-icon>
            Substance
          </button>
        </ng-template>
        <ng-template [ngSwitchCase]="1">
          <mat-form-field class="ml-auto" style="width: 200px">
            <mat-label>River</mat-label>
            <mat-select
              (selectionChange)="
                onToolbarActionInvoked('MAP_RIVER_SELECTED', $event.value)
              "
            >
              <mat-option [value]="null">---</mat-option>
              <mat-option
                *ngFor="let entity of RIVERS$ | async"
                [value]="entity.id"
              >
                {{ entity.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </ng-template>
        <ng-template [ngSwitchCase]="2">
          <app-location-filter
            class="ml-auto"
            (selectionChange)="
              onToolbarActionInvoked('CHART_LOCATION_SELECTED', $event)
            "
          ></app-location-filter>
        </ng-template>
      </div>

      <mat-tab-group
        class="flex-auto"
        [(selectedIndex)]="tabGroupSelectedIndex"
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
export class HomeComponent implements OnInit {
  public tabGroupSelectedIndex: number;

  public RIVERS$!: Observable<RiverCRUDModel['getEntitiesResult'][]>;
  public LOCATIONS$$!: BehaviorSubject<LocationCRUDModel['getEntitiesResult'][]>;

  constructor(private apiClient: ApiClient) {
    this.tabGroupSelectedIndex = 2;
  }

  public ngOnInit() {
    this.RIVERS$ = this.apiClient.river.getEntities().pipe(startWith([]));
    this.LOCATIONS$$ = new BehaviorSubject<LocationCRUDModel['getEntitiesResult'][]>([]);
  }

  public onToolbarActionInvoked(key: string, ...params: any[]) {
    TOOLBAR_ACTION$$.next({ key, params });
  }
}
