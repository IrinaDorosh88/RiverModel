import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
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
} from '@/views/measurement-form';
import { RiversComponent } from '@/views/rivers';
import { SubstancesComponent } from '@/views/substances';
import { MeasurementsComponent, MeasurementsData } from '../measurements';

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
  private readonly locations$$;
  private readonly popup;
  public readonly params: { river_id?: number };
  public length;

  private map!: Map;

  public RIVERS$!: Observable<
    RiverCRUDModel['getPaginatedEntitiesResult']['data']
  >;

  constructor(
    private matDialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private apiClient: ApiClient
  ) {
    this.locations$$ = new ReplaySubject<
      LocationCRUDModel['getPaginatedEntitiesResult']
    >(1);
    this.popup = new Popup({ closeButton: false, closeOnClick: false });
    this.params = {};
    this.length = 0;
  }

  public ngOnInit() {
    this.RIVERS$ = this.apiClient.river.getEntities().pipe(startWith([]));
    this.refreshLocations();
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
            scan<LocationCRUDModel['getPaginatedEntitiesResult'], Marker[]>(
              (accumulator, value) => {
                // remove previous markers from map
                accumulator.forEach((item) => {
                  item.remove();
                });
                // add markers for current locations on map
                const result = value.map((item: any) => {
                  const result = new Marker()
                    .setLngLat([item.longitude, item.latitude])
                    .addTo(this.map);
                  const resultE = result.getElement();
                  resultE.classList.add('cursor-pointer');
                  resultE.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openLocationPopup(item, result);
                  });
                  const titleE = document.createElement('div');
                  titleE.textContent = item.name;
                  titleE.classList.add('marker-title');
                  resultE.appendChild(titleE);
                  return result;
                });
                return result;
              },
              []
            )
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
  }

  private onCreateLocationClick(coordinates: {
    longitude: number;
    latitude: number;
  }) {
    this.openLocationDialog({
      coordinates,
      riverId: this.params.river_id,
    });
  }

  private onEditLocationClick(
    entity: LocationCRUDModel['getPaginatedEntitiesResult'][number]
  ) {
    this.openLocationDialog({ entity });
  }

  private onDeleteLocationClick(
    entity: LocationCRUDModel['getPaginatedEntitiesResult'][number]
  ) {
    this.confirmationDialogService.open({
      title: I18N['Delete $name location'](entity.name),
      confirmCallback: () => {
        return this.apiClient.location.deleteEntity(entity.id).pipe(
          tap(() => {
            this.notificationService.notify(
              I18N['$name location is successfully deleted.'](entity.name)
            );
          })
        );
      },
    });
  }

  private onMeasurementsClick(
    entity: LocationCRUDModel['getPaginatedEntitiesResult'][number],
    marker: Marker
  ) {
    this.matDialog
      .open<MeasurementsComponent, MeasurementsData>(MeasurementsComponent, {
        width: '1000px',
        data: { location_id: entity.id },
      })
      .afterClosed()
      .subscribe();
  }

  private onCreateMeasurementClick(
    entity: LocationCRUDModel['getPaginatedEntitiesResult'][number]
  ) {
    this.apiClient.substance
      .getEntities()
      .pipe(
        map((next) => {
          return next.reduce((accumulator, entity) => {
            accumulator[entity.id] = entity.name;
            return accumulator;
          }, {} as { [key: string]: string });
        }),
        switchMap((mapper) => {
          return this.matDialog
            .open<MeasurementFormComponent, MeasurementFormData, boolean>(
              MeasurementFormComponent,
              {
                width: '400px',
                data: {
                  location: entity,
                  mapper,
                },
              }
            )
            .afterClosed();
        })
      )
      .subscribe();
  }

  private onChartClick(
    entity: LocationCRUDModel['getPaginatedEntitiesResult'][number]
  ) {
    this.matDialog
      .open<ChartComponent, ChartComponentData>(ChartComponent, {
        width: '1000px',
        data: { location: entity.id },
      })
      .afterClosed()
      .subscribe();
  }

  public onRiversClick() {
    this.matDialog
      .open(RiversComponent, {
        width: '400px',
        minHeight: '700px',
      })
      .afterClosed()
      .subscribe();
  }

  public onSubstancesClick() {
    this.matDialog
      .open(SubstancesComponent, {
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
    this.refreshLocations();
  }

  private openLocationDialog(data: LocationFormData) {
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
            this.refreshLocations();
          }
        },
      });
  }

  private refreshLocations() {
    this.apiClient.location.getEntities(this.params).subscribe({
      next: (next) => {
        this.locations$$.next(next as any);
      },
    });
  }

  private openNewLocationPopup(coordinates: {
    longitude: number;
    latitude: number;
  }) {
    const content = this.getButton('add_location_alt');
    content.addEventListener('click', () => {
      this.popup.remove();
      this.onCreateLocationClick(coordinates);
    });
    this.popup
      .setLngLat([coordinates.longitude, coordinates.latitude])
      .setDOMContent(content)
      .addTo(this.map);
  }

  private openLocationPopup(
    entity: LocationCRUDModel['getPaginatedEntitiesResult'][number],
    marker: Marker
  ) {
    const content = document.createElement('div');
    content.classList.add('display-flex', 'flex-wrap', 'gap-2');
    let button = this.getButton('edit_location_alt');
    button.addEventListener('click', () => {
      this.popup.remove();
      this.onEditLocationClick(entity);
    });
    content.appendChild(button);
    button = this.getButton('wrong_location');
    button.addEventListener('click', () => {
      this.popup.remove();
      this.onDeleteLocationClick(entity);
    });
    content.appendChild(button);
    button = this.getButton('list_alt');
    button.addEventListener('click', () => {
      this.popup.remove();
      this.onMeasurementsClick(entity, marker);
    });
    content.appendChild(button);
    button = this.getButton('post_add');
    button.addEventListener('click', () => {
      this.popup.remove();
      this.onCreateMeasurementClick(entity);
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
      | 'post_add'
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
