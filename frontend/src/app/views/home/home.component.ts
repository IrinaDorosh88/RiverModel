import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  ReplaySubject,
  map,
  scan,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { Map, Marker, Popup } from 'maplibre-gl';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatSelectModule,
];

import {
  ApiClient,
  LocationCRUDModel,
  RiverCRUDModel,
} from '@/features/api-client';
import { ConfirmationDialogService } from '@/features/confirmation-dialog';
import { I18N } from '@/features/i18n';
import { NotificationService } from '@/features/notification';

import { ChartComponent, ChartComponentData } from '@/views/chart';
import { LocationFormComponent, LocationFormData } from '@/views/location-form';
import {
  MeasurementFormComponent,
  MeasurementFormData,
  MeasurementFormResult,
} from '@/views/measurement-form';
import { RiversTableComponent } from '@/views/rivers-table';
import { SubstancesTableComponent } from '@/views/substances-table';
import {
  MeasurementsTableComponent,
  MeasurementsTableData,
  MeasurementsTableResult,
} from '@/views/measurements-table';
import { ExcessComponent, ExcessData, ExcessResult } from '@/views/excess';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-home',
  template: `
    <div class="home-toolbar">
      <button mat-flat-button color="primary" (click)="onRiversClick()">
        <mat-icon>water</mat-icon>
        {{ I18N['Rivers'] }}
      </button>
      <button mat-flat-button color="primary" (click)="onSubstancesClick()">
        <mat-icon>science</mat-icon>
        {{ I18N['Substances'] }}
      </button>
      <mat-form-field class="ml-auto" style="width: 200px">
        <mat-label>{{ I18N['River'] }}</mat-label>
        <mat-select (selectionChange)="onRiverSelected($event.value)">
          <mat-option [value]="null">---</mat-option>
          <mat-option *ngFor="let item of rivers$$ | async" [value]="item.id">
            {{ item.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    <div class="home-content-wrapper">
      <div class="home-content app-card-container">
        <div class="app-card" style="flex: 3;">
          <div id="map-container" style="height: 100%"></div>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  public readonly I18N = I18N;
  private readonly locations$$: ReplaySubject<
    LocationCRUDModel['getEntitiesResult'][]
  >;
  public readonly params: { river_id?: number };
  private readonly popup: Popup;
  public readonly rivers$$: BehaviorSubject<
    RiverCRUDModel['getPaginatedEntitiesResult'][]
  >;
  public length: number;
  private map!: Map;

  constructor(
    private matDialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private apiClient: ApiClient
  ) {
    this.locations$$ = new ReplaySubject(1);
    this.params = {};
    this.popup = new Popup({ closeButton: false, closeOnClick: false });
    this.rivers$$ = new BehaviorSubject([] as any);
    this.length = 0;
  }

  public ngOnInit() {
    this.refreshRiversSelect();
    this.refreshLocationsMap();
  }

  public ngAfterViewInit() {
    this.map = new Map({
      container: 'map-container',
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${'n88LfTJPWSHvvGGIETtw'}`,
      center: [31.1828699, 48.383022],
      zoom: 5.4,
      attributionControl: false,
    })
      .on('load', () => {
        this.locations$$
          .pipe(
            scan((accumulator, next) => {
              // remove previous markers from map
              accumulator.forEach((item) => {
                item.remove();
              });
              // add markers for current locations on map
              const result = next.map((item) => {
                const marker = new Marker()
                  .setLngLat([item.longitude, item.latitude])
                  .addTo(this.map);
                const markerE = marker.getElement();
                markerE.classList.add('cursor-pointer');
                markerE.addEventListener('click', (e) => {
                  e.stopPropagation();
                  this.openLocationPopup(item);
                });
                const titleE = document.createElement('div');
                titleE.textContent = item.name;
                titleE.classList.add('marker-title');
                markerE.appendChild(titleE);
                return marker;
              });
              return result;
            }, [] as Marker[])
          )
          .subscribe();
      })
      .on('click', (e) => {
        this.openNewLocationPopup({
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
        });
      });
  }

  public ngOnDestroy(): void {
    this.locations$$.complete();
    this.rivers$$.complete();
  }

  private onCreateClick(coordinates: {
    longitude: number;
    latitude: number;
  }) {
    this.openDialog({
      coordinates,
      riverId: this.params.river_id,
    });
  }

  private onDeleteClick(
    entity: LocationCRUDModel['getEntitiesResult']
  ) {
    this.confirmationDialogService.open({
      title: I18N['Delete $name location'](entity.name),
      confirmCallback: () => {
        return this.apiClient.location.deleteEntity(entity.id).pipe(
          tap(() => {
            this.notificationService.notify(
              I18N['$name location is successfully deleted.'](entity.name)
            );
            this.refreshLocationsMap();
          })
        );
      },
    });
  }

  private onEditClick(entity: LocationCRUDModel['getEntitiesResult']) {
    this.openDialog({ entity });
  }

  private onMeasurementsClick(entity: LocationCRUDModel['getEntitiesResult']) {
    this.matDialog
      .open<
        MeasurementsTableComponent,
        MeasurementsTableData,
        MeasurementsTableResult
      >(MeasurementsTableComponent, {
        width: '400px',
        data: { location: entity },
      })
      .afterClosed()
      .subscribe({
        next: (next) => {
          if (next) {
            this.onChartClick(entity, next);
          }
        },
      });
  }

  private onChartClick(
    entity: LocationCRUDModel['getEntitiesResult'],
    substance_id?: number
  ) {
    this.apiClient.measurement
      .getEntities({ location_id: entity.id })
      .pipe(
        switchMap((next) =>
          next.length
            ? this.matDialog
                .open<ChartComponent, ChartComponentData>(ChartComponent, {
                  data: {
                    measurement: next[0],
                    substance_id,
                  },
                })
                .afterClosed()
            : EMPTY.pipe(
                tap({
                  complete: () => {
                    this.notificationService.notify(
                      I18N[
                        'You should add at least one measurement before prediction modeling.'
                      ]
                    );
                  },
                })
              )
        )
      )
      .subscribe();
  }

  public onRiversClick() {
    this.matDialog
      .open(RiversTableComponent, {
        width: '400px',
        minHeight: '700px',
      })
      .afterClosed()
      .subscribe({
        next: (next) => {
          if (next) {
            this.refreshRiversSelect();
          }
        },
      });
  }

  public onSubstancesClick() {
    this.matDialog
      .open(SubstancesTableComponent, {
        width: '600px',
        minHeight: '700px',
      })
      .afterClosed()
      .subscribe();
  }

  public onRiverSelected(river_id: number | null) {
    if (river_id) {
      this.params.river_id = river_id;
    } else {
      delete this.params.river_id;
    }
    this.refreshLocationsMap();
  }

  private openDialog(data: LocationFormData) {
    this.matDialog
      .open<LocationFormComponent, LocationFormData, boolean>(
        LocationFormComponent,
        {
          width: '400px',
          data,
        }
      )
      .afterClosed()
      .subscribe({
        next: (next) => {
          if (next) {
            this.refreshLocationsMap();
          }
        },
      });
  }

  private refreshLocationsMap() {
    this.apiClient.location.getEntities(this.params).subscribe({
      next: (next) => {
        this.locations$$.next(next as any);
      },
    });
  }

  private refreshRiversSelect() {
    this.apiClient.river.getEntities().subscribe({
      next: (next) => this.rivers$$.next(next),
    });
  }

  private openNewLocationPopup(coordinates: {
    longitude: number;
    latitude: number;
  }) {
    const content = this.getButton('add_location_alt');
    content.addEventListener('click', () => {
      this.popup.remove();
      this.onCreateClick(coordinates);
    });
    this.popup
      .setLngLat([coordinates.longitude, coordinates.latitude])
      .setDOMContent(content)
      .addTo(this.map);
  }

  private openLocationPopup(entity: LocationCRUDModel['getEntitiesResult']) {
    const content = document.createElement('div');
    content.classList.add('display-flex', 'flex-wrap', 'g-2');
    content.style.justifyContent = 'center';
    content.style.width = '120px';
    let button = this.getButton('edit_location_alt');
    button.addEventListener('click', () => {
      this.popup.remove();
      this.onEditClick(entity);
    });
    content.appendChild(button);
    button = this.getButton('wrong_location');
    button.addEventListener('click', () => {
      this.popup.remove();
      this.onDeleteClick(entity);
    });
    content.appendChild(button);
    button = this.getButton('list_alt');
    button.addEventListener('click', () => {
      this.popup.remove();
      this.onMeasurementsClick(entity);
    });
    content.appendChild(button);
    button = this.getButton('show_chart');
    button.addEventListener('click', () => {
      this.popup.remove();
      this.onChartClick(entity);
    });
    content.appendChild(button);
    this.popup
      .setLngLat([entity.longitude, entity.latitude])
      .setDOMContent(content)
      .addTo(this.map);
  }

  private getButton(
    textContent:
      | 'add_location_alt'
      | 'edit_location_alt'
      | 'wrong_location'
      | 'list_alt'
      | 'show_chart'
  ) {
    const result = document.createElement('button');
    result.textContent = textContent;
    result.classList.add('material-icons', 'map-mini-fab-button');
    switch (textContent) {
      case 'edit_location_alt':
        result.classList.add('background-color-accent');
        break;
      case 'wrong_location':
        result.classList.add('background-color-warn');
        break;
      default:
        result.classList.add('background-color-primary');
        break;
    }
    return result;
  }
}
