import { Component, importProvidersFrom } from '@angular/core';
import { ApplicationConfig } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';

import { ENVIRONMENT_INITIALIZER } from './app-init';

const APP_IMPORTS: any[] = [];
const APP_ROUTES: Routes = [];

@Component({
  standalone: true,
  imports: APP_IMPORTS,
  selector: 'app-root',
  template: ` {{ title }} `,
})
export class AppComponent {
  public title = 'RiverModel';
}

export const APP_CONFIG: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(APP_ROUTES),
    ENVIRONMENT_INITIALIZER,
  ],
};
