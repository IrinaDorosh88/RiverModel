import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Map } from 'maplibre-gl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private map: Map | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    const initialState = { lng: 31.1828699, lat: 48.383022, zoom: 5.7 };
    // this.map = new Map({
    //   container: this.mapContainer.nativeElement,
    //   style: `https://api.maptiler.com/maps/streets-v2/style.json?key=n88LfTJPWSHvvGGIETtw`,
    //   center: [initialState.lng, initialState.lat],
    //   zoom: initialState.zoom,
    // });
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
