import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, BehaviorSubject, startWith, map } from 'rxjs';

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

import {
  RiverCRUDModel,
  ApiClient,
  LocationCRUDModel,
} from '@/features/api-client';
import { I18N } from '@/features/i18n';

import { ChartComponent } from '@/views/chart';
import { LocationFilterComponent } from '@/views/location-filter';
import { MapComponent } from '@/views/map';
const VIEWS = [ChartComponent, LocationFilterComponent, MapComponent];

export const TOOLBAR_ACTION$$ = new Subject<{
  key: string;
  params: any[];
}>();

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES, ...VIEWS],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-home',
  template: `
    <div class="home-toolbar" [ngSwitch]="tabGroupSelectedIndex">
      <ng-template [ngSwitchCase]="0">
        <button
          mat-flat-button
          color="primary"
          (click)="onToolbarActionInvoked('RIVERS')"
        >
          <mat-icon>water</mat-icon>
          {{ I18N['Rivers'] }}
        </button>
        <button
          mat-flat-button
          color="primary"
          (click)="onToolbarActionInvoked('SUBSTANCES')"
        >
          <mat-icon>science</mat-icon>
          {{ I18N['Substances'] }}
        </button>
        <mat-form-field class="ml-auto" style="width: 200px">
          <mat-label>{{ I18N['River'] }}</mat-label>
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
      <ng-template [ngSwitchCase]="1">
        <app-location-filter
          class="ml-auto"
          (selectionChange)="
            onToolbarActionInvoked('CHART_LOCATION_SELECTED', $event)
          "
        ></app-location-filter>
      </ng-template>
    </div>

    <mat-tab-group [(selectedIndex)]="tabGroupSelectedIndex">
      <mat-tab [label]="I18N['Map']">
        <ng-template matTabContent>
          <div class="home-content-wrapper">
            <app-map></app-map>
          </div>
        </ng-template>
      </mat-tab>
      <mat-tab [label]="I18N['Chart']">
        <ng-template matTabContent>
          <div class="home-content-wrapper">
            <app-chart></app-chart>
          </div>
        </ng-template>
      </mat-tab>
    </mat-tab-group>
  `,
})
export class HomeComponent implements OnInit {
  public readonly I18N = I18N;
  public tabGroupSelectedIndex: number;

  public RIVERS$!: Observable<
    RiverCRUDModel['getPaginatedEntitiesResult']['data']
  >;
  public LOCATIONS$$!: BehaviorSubject<
    LocationCRUDModel['getPaginatedEntitiesResult'][]
  >;

  constructor(private apiClient: ApiClient) {
    this.tabGroupSelectedIndex = 0;
  }

  public ngOnInit() {
    this.RIVERS$ = this.apiClient.river.getPaginatedEntities().pipe(
      map((next) => next.data),
      startWith([])
    );
    this.LOCATIONS$$ = new BehaviorSubject<
      LocationCRUDModel['getPaginatedEntitiesResult'][]
    >([]);
  }

  public onToolbarActionInvoked(key: string, ...params: any[]) {
    TOOLBAR_ACTION$$.next({ key, params });
  }
}
