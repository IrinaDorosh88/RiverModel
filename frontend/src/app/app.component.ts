import {
  ApplicationConfig,
  Component,
  importProvidersFrom,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
const MATERIAL_MODULES = [MatDialogModule];

import { bearerAuthenticationInterceptorFn } from '@/features/bearer-authentication';
import { ENVIRONMENT_INITIALIZER_PROVIDER } from '@/features/environment-init';

import { LoaderComponent, loaderInterceptorFn } from '@/features/loading';
import { NOTIFICATION_PROVIDERS } from '@/features/notification';
import { USER_INITIALIZER_PROVIDER } from '@/features/user';

import { LayoutComponent } from '@/views/layout';
const VIEWS = [LayoutComponent];

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES, LoaderComponent, ...VIEWS],
  selector: 'app-root',
  template: `
    <app-loader></app-loader>
    <app-layout></app-layout>
  `,
})
export class AppComponent {}

export const APP_CONFIG: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(
      withInterceptors([loaderInterceptorFn, bearerAuthenticationInterceptorFn])
    ),
    ENVIRONMENT_INITIALIZER_PROVIDER,
    USER_INITIALIZER_PROVIDER,
    ...NOTIFICATION_PROVIDERS,
    importProvidersFrom(MatDialogModule, MatNativeDateModule),
  ],
};
