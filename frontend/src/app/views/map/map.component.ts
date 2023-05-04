import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReplaySubject,
  Subscription,
  combineLatestWith,
  map,
  scan,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { Map, Marker, Popup } from 'maplibre-gl';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatTableModule,
];

import {
  ApiClient,
  LocationCRUDModel,
  MeasurementCRUDModel,
} from '@/features/api-client';
import { ConfirmationDialogService } from '@/features/confirmation-dialog';
import { NotificationService } from '@/features/notification';

import { TOOLBAR_ACTION$$ } from '@/views/home';

import {
  LocationFormComponent,
  LocationFormData,
} from './location-form.component';
import {
  MeasurementFormComponent,
  MeasurementFormData,
} from './measurement-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-map',
  template: `
    <div class="home-content app-card-container">
      <div class="app-card" style="flex: 3;">
        <div id="map-container" style="height: 100%"></div>
      </div>
      <div class="app-card background-color-white" style="flex: 2;">
        <ng-template
          [ngIf]="DATA_SOURCE$ | async"
          [ngIfElse]="noData"
          let-dataSource
        >
          <mat-paginator
            [length]="length"
            [hidePageSize]="true"
            [pageSize]="10"
            [showFirstLastButtons]="true"
            (page)="onPaginatorPage($event)"
          ></mat-paginator>
          <table mat-table class="p-3" [dataSource]="dataSource">
            <ng-container matColumnDef="date">
              <th *matHeaderCellDef mat-header-cell>Date</th>
              <td *matCellDef="let item" mat-cell>
                {{ item.date | date : 'dd/MM/yyyy' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="values">
              <th *matHeaderCellDef mat-header-cell>Values</th>
              <td *matCellDef="let item" mat-cell>
                <div [innerHTML]="item.innerHTML"></div>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="DISPLAYED_COLUMNS"></tr>
            <tr mat-row *matRowDef="let row; columns: DISPLAYED_COLUMNS"></tr>
          </table>
        </ng-template>
        <ng-template #noData>
          <div
            class="display-flex align-items-center justify-content-center"
            style="height: 100%"
          >
            Choose location to display Measurements
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly LOCATIONS$$;
  private readonly MEASUREMENTS$$;
  private readonly POPUP;
  private readonly SUBSCRIPTIONS;
  private readonly SUBSTANCES_MAPPER$;
  public readonly DATA_SOURCE$;
  public readonly DISPLAYED_COLUMNS;
  public readonly filtrationParams: { location?: number };
  public readonly paginationParams: { limit: number; offset?: number };
  public length;
  public river: number | null;
  private get params() {
    return {
      ...this.filtrationParams,
      ...this.paginationParams,
    };
  }

  private map!: Map;

  public currentLocationAndMarker:
    | {
        location: LocationCRUDModel['getPaginatedEntitiesResult'][number];
        marker: Marker;
      }
    | undefined;

  constructor(
    private matDialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private apiClient: ApiClient
  ) {
    this.DISPLAYED_COLUMNS = ['date', 'values'];
    this.LOCATIONS$$ = new ReplaySubject<
      LocationCRUDModel['getPaginatedEntitiesResult']
    >(1);
    this.MEASUREMENTS$$ = new ReplaySubject<
      MeasurementCRUDModel['getPaginatedEntitiesResult']['data'] | undefined
    >(1);
    this.POPUP = new Popup({ closeButton: false, closeOnClick: false });
    this.SUBSCRIPTIONS = new Subscription();
    this.SUBSTANCES_MAPPER$ = this.apiClient.substance.getPaginatedEntities().pipe(
      map((next) => {
        return next.data.reduce((accumulator, entity) => {
          accumulator[entity.id] = entity.name;
          return accumulator;
        }, {} as { [key: string]: string });
      }),
      shareReplay(1)
    );
    this.DATA_SOURCE$ = this.MEASUREMENTS$$.pipe(
      combineLatestWith(this.SUBSTANCES_MAPPER$),
      map((next) => {
        return next[0]?.map((entity) => {
          return {
            id: entity.id,
            date: entity.date,
            innerHTML: Object.entries(entity.values).reduce<string>(
              (accumulator, [key, value]) => {
                accumulator += `<div><b>${next[1][key]}</b>: ${value}</div>`;
                return accumulator;
              },
              ''
            ),
          };
        });
      })
    );
    this.filtrationParams = {};
    this.paginationParams = { limit: 10 };
    this.length = 0;
    this.river = null;
  }

  public ngOnInit() {
    this.SUBSCRIPTIONS.add(
      TOOLBAR_ACTION$$.subscribe({
        next: ({ key, params }) => {
          switch (key) {
            case 'MAP_RIVER_SELECTED':
              this.onRiverSelected(params[0]);
              break;
          }
        },
      })
    );
    this.refreshLocations();
  }

  public ngAfterViewInit() {
    this.map = new Map({
      container: 'map-container',
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${'n88LfTJPWSHvvGGIETtw'}`,
      center: [31.1828699, 48.383022],
      zoom: 5,
      attributionControl: false,
    })
      .on('load', () => {
        this.LOCATIONS$$.pipe(
          scan<LocationCRUDModel['getPaginatedEntitiesResult'], Marker[]>(
            (accumulator, value) => {
              // remove previous markers from map
              accumulator.forEach((item) => {
                item.remove();
              });
              // add markers for current locations on map
              let shouldClearMeasurementsTab = true;
              const result = value.map((item) => {
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
                if (
                  shouldClearMeasurementsTab &&
                  this.currentLocationAndMarker &&
                  this.currentLocationAndMarker.location.id == item.id
                ) {
                  this.currentLocationAndMarker = {
                    location: item,
                    marker: result,
                  };
                  resultE.classList.add('active');
                  shouldClearMeasurementsTab = false;
                }
                return result;
              });
              if (shouldClearMeasurementsTab) {
                this.MEASUREMENTS$$.next(undefined);
                this.currentLocationAndMarker = undefined;
              }
              return result;
            },
            []
          )
        ).subscribe();
      })
      .on('click', (e) => {
        this.openNewLocationPopup({
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
        });
      });
  }

  public ngOnDestroy(): void {
    this.SUBSCRIPTIONS.unsubscribe();
    this.LOCATIONS$$.complete();
  }

  public onPaginatorPage(event: PageEvent) {
    if (event.pageIndex) {
      this.paginationParams.offset =
        event.pageIndex * this.paginationParams.limit;
    } else {
      delete this.paginationParams.offset;
    }
    this.refreshMeasurements();
  }

  private onCreateClick(coordinates: { longitude: number; latitude: number }) {
    this.openDialog({
      coordinates,
      riverId: this.river,
    });
  }

  private onEditClick(entity: LocationCRUDModel['getPaginatedEntitiesResult'][number]) {
    this.openDialog({ entity });
  }

  private onDeleteClick(
    entity: LocationCRUDModel['getPaginatedEntitiesResult'][number]
  ) {
    this.confirmationDialogService.open({
      title: `Delete ${entity.name}`,
      confirmCallback: () => {
        return this.apiClient.location.deleteEntity(entity.id).pipe(
          tap(() => {
            this.notificationService.notify(
              `${entity.name} is successfully deleted!`
            );
          })
        );
      },
    });
  }

  private onAddMeasurementsClicked(
    entity: LocationCRUDModel['getPaginatedEntitiesResult'][number],
    marker: Marker
  ) {
    this.SUBSTANCES_MAPPER$.pipe(
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
    ).subscribe({
      next: (next) => {
        if (next) {
          this.onDisplayMeasurementsClicked(entity, marker);
        }
      },
    });
  }

  private onDisplayMeasurementsClicked(
    entity: LocationCRUDModel['getPaginatedEntitiesResult'][number],
    marker: Marker
  ) {
    this.filtrationParams.location = entity.id;
    delete this.paginationParams.offset;
    this.length = 0;
    this.refreshMeasurements(entity, marker);
  }

  private onRiverSelected(river: number | null) {
    this.river = river;
    this.refreshLocations();
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
            this.refreshLocations();
          }
        },
      });
  }

  private refreshLocations() {
    let params;
    if (this.river) {
      params = { river: this.river };
    }
    this.apiClient.location.getPaginatedEntities(params).subscribe({
      next: (next) => {
        this.LOCATIONS$$.next(next);
      },
    });
  }

  private refreshMeasurements(
    entity?: LocationCRUDModel['getPaginatedEntitiesResult'][number],
    marker?: Marker
  ) {
    console.log({ MEASUREMENTS: this.params });
    this.apiClient.measurement.getPaginatedEntities(this.params).subscribe({
      next: (next) => {
        if (this.currentLocationAndMarker) {
          this.currentLocationAndMarker.marker
            .getElement()
            .classList.remove('active');
        }
        if (entity && marker) {
          this.currentLocationAndMarker = {
            location: entity,
            marker,
          };
          marker.getElement().classList.add('active');
        }
        this.length = next.count;
        this.MEASUREMENTS$$.next(next.data);
      },
    });
  }

  private openNewLocationPopup(coordinates: {
    longitude: number;
    latitude: number;
  }) {
    const content = this.getButton('add_location_alt');
    content.addEventListener('click', () => {
      this.POPUP.remove();
      this.onCreateClick(coordinates);
    });
    this.POPUP.setLngLat([coordinates.longitude, coordinates.latitude])
      .setDOMContent(content)
      .addTo(this.map);
  }

  private openLocationPopup(
    entity: LocationCRUDModel['getPaginatedEntitiesResult'][number],
    marker: Marker
  ) {
    const content = document.createElement('div');
    content.classList.add('display-flex', 'gap-2');
    let button = this.getButton('edit_location_alt');
    button.addEventListener('click', () => {
      this.POPUP.remove();
      this.onEditClick(entity);
    });
    content.appendChild(button);
    button = this.getButton('wrong_location');
    button.addEventListener('click', () => {
      this.POPUP.remove();
      this.onDeleteClick(entity);
    });
    content.appendChild(button);
    button = this.getButton('list_alt');
    button.addEventListener('click', () => {
      this.POPUP.remove();
      this.onDisplayMeasurementsClicked(entity, marker);
    });
    content.appendChild(button);
    button = this.getButton('post_add');
    button.addEventListener('click', () => {
      this.POPUP.remove();
      this.onAddMeasurementsClicked(entity, marker);
    });
    content.appendChild(button);
    this.POPUP.setLngLat([entity.longitude, entity.latitude])
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
