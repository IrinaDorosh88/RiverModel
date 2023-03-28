import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LngLatLike, Map, Marker, Popup } from 'maplibre-gl';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
];

const MARKERS = [
  {
    country: 'Chernivtsi',
    lng: 25.94034,
    lat: 48.29149,
  },
];

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-map',
  template: `
    <div class="height-full p-5 display-flex flex-wrap gap-5 overflow-y-auto">
      <div
        class="card-box-shadow p-2 background-color-white"
        style="flex: 3;"
      >
        <div #mapContainer class="height-full"></div>
      </div>
      <div
        class="card-box-shadow p-2 background-color-white"
        style="flex: 2;"
      >
        <div
          class="height-full display-flex align-items-center justify-content-center"
          style="font-size: 2rem; color: white; background-color: red"
        >
          Markers HERE
        </div>
      </div>
    </div>
  `,
})
export class MapComponent {
  @ViewChild('mapContainer')
  private mapContainer!: ElementRef<HTMLElement>;

  // private readonly TOOLBAR_ACTION_MAPPER: {
  //   [key: string]: (...params: any) => void;
  // } = {};
  private map!: Map;
  private popup: Popup;

  constructor() {
    this.popup = new Popup({ closeButton: false, closeOnClick: false });
  }

  public ngOnInit() {
    // this.subscription = TOOLBAR_ACTION$$.subscribe({
    //   next: ({ key, params }) => this.TOOLBAR_ACTION_MAPPER[key]?.(...params),
    // });
  }

  ngAfterViewInit() {
    const initialState = { lng: 31.1828699, lat: 48.383022, zoom: 5.7 };
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=n88LfTJPWSHvvGGIETtw`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
      attributionControl: false,
    })
      .on('load', () => {
        MARKERS.forEach((item) => {
          const marker = new Marker().setLngLat(item);
          marker.addTo(this.map);
          marker.getElement().addEventListener('click', (e) => {
            e.stopPropagation();
            this.openPopup(item);
          });
        });
      })
      .on('click', (e) => {
        this.openPopup(e.lngLat, true);
      });
  }

  // private subscription!: Subscription;
  public ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

  public onCreateMarkerClick(coordinates: { lng: number; lat: number }) {
    console.log('Create new Marker!', coordinates);
  }

  private openPopup(lngLat: LngLatLike, creation?: true | undefined) {
    this.popup
      .setLngLat(lngLat)
      .setDOMContent(this.getPopupContent(lngLat, creation))
      .addTo(this.map);
  }

  private closePopup() {
    this.popup.remove();
  }

  private getPopupContent(
    context: any,
    creation?: true | undefined
  ): HTMLElement {
    if (creation) {
      const result = this.getButton('add');
      result.addEventListener('click', () => {
        this.closePopup();
        this.onCreateClick(context);
      });
      return result;
    } else {
      const buttonE1 = this.getButton('edit');
      buttonE1.addEventListener('click', () => {
        this.closePopup();
        this.onEditClick(context);
      });
      const buttonE2 = this.getButton('delete');
      buttonE2.addEventListener('click', () => {
        this.closePopup();
        this.onDeleteClick(context);
      });
      const result = document.createElement('div');
      result.classList.add('display-flex', 'gap-2');
      result.appendChild(buttonE1);
      result.appendChild(buttonE2);
      return result;
    }
  }

  private getButton(type: 'add' | 'edit' | 'delete') {
    const result = document.createElement('button');
    result.textContent = type;
    result.classList.add('material-icons', 'map-mini-fab-button');
    switch (type) {
      case 'add':
        result.classList.add('background-color-primary');
        break;
      case 'edit':
        result.classList.add('background-color-accent');
        break;
      case 'delete':
        result.classList.add('background-color-warn');
        break;
    }
    return result;
  }

  private onCreateClick(lngLat: LngLatLike) {
    console.log({ CREATE: lngLat });
  }

  private onEditClick(item: any & LngLatLike) {
    console.log({ EDIT: item });
  }

  private onDeleteClick(item: any & LngLatLike) {
    console.log({ DELETE: item });
  }
}
