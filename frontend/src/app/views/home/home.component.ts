import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, BehaviorSubject, startWith, map } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatSelectModule,
];

import {
  RiverCRUDModel,
  ApiClient,
  LocationCRUDModel,
} from '@/features/api-client';
import { I18N } from '@/features/i18n';

import { MapComponent } from '@/views/map';
const VIEWS = [MapComponent];

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
    </div>

    <div class="home-content-wrapper">
      <app-map></app-map>
    </div>
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
