import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Map, Marker, Popup } from 'maplibre-gl';

const MATERIAL_MODULES: any[] = [];

import { HOME_TOOLBAR_ACTION$$ } from './home.component';

const COUNTRIES = [
  {
    country: 'Albania',
    latitude: 41,
    longitude: 20,
  },
  {
    country: 'Algeria',
    latitude: 28,
    longitude: 3,
  },
  {
    country: 'American Samoa',
    latitude: -14.3333,
    longitude: -170,
  },
];

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-map',
  template: `
    <div
      class="height-full p-5 display-flex flex-wrap gap-5"
      style="overflow-y: auto;"
    >
      <div
        #map
        class="height-full"
        style="flex: 3; border: 0.5rem solid #fff; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;"
      ></div>
      <div
        class="height-full"
        style="flex: 2; border: 0.5rem solid #fff; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;"
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
  private readonly HOME_TOOLBAR_ACTION_MAPPER: {
    [key: string]: (...params: any) => void;
  } = {
    CREATE: this.onCreateClick.bind(this),
  };

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;
  private map!: Map;

  public ngOnInit() {
    this.subscription = HOME_TOOLBAR_ACTION$$.subscribe({
      next: ({ key, params }) =>
        this.HOME_TOOLBAR_ACTION_MAPPER[key](...params),
    });
  }

  ngAfterViewInit() {
    // const initialState = { lng: 31.1828699, lat: 48.383022, zoom: 5.7 };
    // this.map = new Map({
    //   container: this.mapContainer.nativeElement,
    //   style: `https://api.maptiler.com/maps/streets-v2/style.json?key=n88LfTJPWSHvvGGIETtw`,
    //   center: [initialState.lng, initialState.lat],
    //   zoom: initialState.zoom,
    //   attributionControl: false,
    // });
    // this.map.on('load', (e) => {
    //   COUNTRIES.forEach((item) => {
    //     const marker = new Marker().setLngLat([item.longitude, item.latitude]);
    //     marker.getElement().addEventListener('click', (e) => {
    //       e.stopPropagation();
    //       console.log({
    //         layer: 'Marker',
    //         lngLat: { lng: item.longitude, lat: item.latitude },
    //       });
    //       marker.remove();
    //     });
    //     marker.addTo(this.map);
    //   });
    // });
    // this.map.on('click', (e) => {
    //   console.log({ layer: 'Map', lngLat: e.lngLat });
    //   const popup = new Popup();
    //   const buttonE = document.createElement('button');
    //   buttonE.textContent = 'Click Me';
    //   buttonE.addEventListener('click', () => {
    //     this.onCreateMarkerClick(e.lngLat);
    //     popup._closeButton.click();
    //   });
    //   popup.setLngLat(e.lngLat).setDOMContent(buttonE).addTo(this.map);
    // });
  }

  private subscription!: Subscription;
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private onCreateClick() {
    console.log('Hello from Map!');
  }

  public onCreateMarkerClick(coordinates: { lng: number; lat: number }) {
    console.log('Create new Marker!', coordinates);
  }
}
