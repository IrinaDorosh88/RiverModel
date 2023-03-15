import { Component, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationConfig } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
const MATERIAL_MODULES = [MatButtonModule, MatIconModule, MatToolbarModule];

import { APP_VIEWS, HomeComponent } from './views';

import { ENVIRONMENT_INITIALIZER } from './app-init';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ...MATERIAL_MODULES, ...APP_VIEWS],
  selector: 'app-root',
  template: `
    <mat-toolbar class="gap-3 flex-shrink-0" color="primary">
      <span class="primary">LOGO HERE</span>
      <div class="flex-auto"></div>
      <ng-container *ngIf="user$ | async; else nonAuthorized">
        <button mat-button><span>Sign out</span></button>
      </ng-container>
      <ng-template #nonAuthorized>
        <button mat-button><span>Sign in</span></button>
        <button mat-button><span>Sign up</span></button>
      </ng-template>
    </mat-toolbar>
    <div class="flex-auto">
      <router-outlet></router-outlet>
    </div>
  `,
  host: { class: 'h-full d-flex flex-column' },
})
export class AppComponent {
  public title = 'RiverModel';
  public user$: Observable<any | undefined>;

  constructor() {
    this.user$ = of(undefined);
  }
}

const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
];

export const APP_CONFIG: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(APP_ROUTES),
    ENVIRONMENT_INITIALIZER,
  ],
};
