import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, Subscription, scan, tap } from 'rxjs';
import { Map, Marker, Popup } from 'maplibre-gl';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
];

import { LocationCRUDModel, LocationService } from '@app/features/api-client';
import { HttpClientQueryParams } from '@app/features/http-client-extensions';
import { ConfirmationDialogService } from '@app/features/confirmation-dialog';
import { NotificationService } from '@app/features/notification';

import { TOOLBAR_ACTION$$ } from '@app/views/home';

import {
  LocationFormComponent,
  LocationFormData,
} from './location-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-map',
  template: `
    <div class="height-full p-5 display-flex flex-wrap gap-5 overflow-y-auto">
      <div class="card-box-shadow p-2 background-color-white" style="flex: 3;">
        <div #mapContainer class="height-full"></div>
      </div>
      <div class="card-box-shadow p-2 background-color-white" style="flex: 2;">
        <div
          class="height-full display-flex align-items-center justify-content-center"
          style="font-size: 2rem; color: white; background-color: red"
        >
          Measurements HERE
        </div>
      </div>
    </div>
  `,
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly LOCATIONS$$;
  private readonly POPUP;
  private readonly QUERY_PARAMS: NonNullable<HttpClientQueryParams>;
  private readonly SUBSCRIPTIONS;

  @ViewChild('mapContainer')
  private mapContainer!: ElementRef<HTMLElement>;
  private map!: Map;

  constructor(
    private matDialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private locationService: LocationService
  ) {
    this.LOCATIONS$$ = new BehaviorSubject<
      LocationCRUDModel['getEntitiesResult'][]
    >([]);
    this.POPUP = new Popup({ closeButton: false, closeOnClick: false });
    this.QUERY_PARAMS = {};
    this.SUBSCRIPTIONS = new Subscription();
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
    this.refreshEntities();
  }

  public ngAfterViewInit() {
    const initialState = { lng: 31.1828699, lat: 48.383022, zoom: 5.7 };
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=n88LfTJPWSHvvGGIETtw`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
      attributionControl: false,
    })
      .on('load', () => {
        this.SUBSCRIPTIONS.add(
          this.LOCATIONS$$.pipe(
            scan<LocationCRUDModel['getEntitiesResult'][], Marker[]>(
              (accumulator, value) => {
                // remove previous markers from map
                accumulator.forEach((item) => {
                  item.remove();
                });
                // add markers for current locations on map
                return value.map((item) => {
                  const result = new Marker()
                    .setLngLat([item.longitude, item.latitude])
                    .addTo(this.map);
                  result.getElement().addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openPopup(item);
                  });
                  return result;
                });
              },
              []
            )
          ).subscribe()
        );
      })
      .on('click', (e) => {
        this.openPopup(
          { longitude: e.lngLat.lng, latitude: e.lngLat.lat },
          true
        );
      });
  }

  public ngOnDestroy(): void {
    this.SUBSCRIPTIONS.unsubscribe();
  }

  private onCreateClicked(coordinates: any) {
    this.openDialog({ coordinates });
  }

  private onEditClicked(entity: any) {
    this.openDialog({ entity });
  }

  private onDeleteClicked(item: any) {
    this.confirmationDialogService.open({
      title: `Delete ${item.name}`,
      confirmCallback: () => {
        return this.locationService.deleteEntity(item.id).pipe(
          tap(() => {
            this.notificationService.notify(
              `${item.name} is successfully deleted!`
            );
          })
        );
      },
    });
  }

  private onAddMeasurementsClicked(item: any) {
    console.log({ ADD_MEASUREMENTS: item });
  }

  private onRiverSelected(riverId: number | undefined) {
    if (riverId) {
      this.QUERY_PARAMS['riverId'] = riverId;
    } else {
      delete this.QUERY_PARAMS['riverId'];
    }
    this.refreshEntities();
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
            this.refreshEntities();
          }
        },
      });
  }

  private refreshEntities() {
    this.locationService.getEntities(this.QUERY_PARAMS).subscribe({
      next: (next) => {
        this.LOCATIONS$$.next(next);
      },
    });
  }

  private openPopup(lngLat: any, creation?: true | undefined) {
    this.POPUP.setLngLat([lngLat.longitude, lngLat.latitude])
      .setDOMContent(this.getPopupContent(lngLat, creation))
      .addTo(this.map);
  }

  private closePopup() {
    this.POPUP.remove();
  }

  private getPopupContent(
    context: any,
    creation?: true | undefined
  ): HTMLElement {
    if (creation) {
      const result = this.getButton('add_location_alt');
      result.addEventListener('click', () => {
        this.closePopup();
        this.onCreateClicked(context);
      });
      return result;
    } else {
      const buttonE1 = this.getButton('edit_location_alt');
      buttonE1.addEventListener('click', () => {
        this.closePopup();
        this.onEditClicked(context);
      });
      const buttonE2 = this.getButton('wrong_location');
      buttonE2.addEventListener('click', () => {
        this.closePopup();
        this.onDeleteClicked(context);
      });
      const buttonE3 = this.getButton('post_add');
      buttonE3.addEventListener('click', () => {
        this.closePopup();
        this.onAddMeasurementsClicked(context);
      });
      const result = document.createElement('div');
      result.classList.add('display-flex', 'gap-2');
      result.appendChild(buttonE1);
      result.appendChild(buttonE2);
      result.appendChild(buttonE3);
      return result;
    }
  }

  private getButton(
    type:
      | 'add_location_alt'
      | 'edit_location_alt'
      | 'wrong_location'
      | 'post_add'
  ) {
    const result = document.createElement('button');
    result.textContent = type;
    result.classList.add('material-icons', 'map-mini-fab-button');
    switch (type) {
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
