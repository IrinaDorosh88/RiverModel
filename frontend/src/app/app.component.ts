import { ApplicationConfig, Component, importProvidersFrom, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
const MATERIAL_MODULES = [MatButtonModule, MatDialogModule, MatIconModule];

import { AuthorizationComponent } from '@/views/authorization';
import { HomeComponent } from '@/views/home';
const VIEWS = [AuthorizationComponent, HomeComponent];

import { ApiClient } from '@/features/api-client';
import { bearerAuthenticationInterceptorFn } from '@/features/bearer-authentication';
import { ENVIRONMENT_INITIALIZER_PROVIDER } from '@/features/environment-init';
import { changeLanguage, I18N } from '@/features/i18n';
import { LoaderComponent, loaderInterceptorFn } from '@/features/loading';
import {
  NotificationService,
  NOTIFICATION_PROVIDERS,
} from '@/features/notification';
import { User, USER_INITIALIZER_PROVIDER } from '@/features/user';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES, LoaderComponent, ...VIEWS],
  selector: 'app-root',
  template: `
    <app-loader></app-loader>
    <div class="app-toolbar">
      <img class="mr-auto" src="./assets/logo.svg" />
      <ng-template [ngIf]="user$ | async" [ngIfElse]="nonAuthorizedUserButtons">
        <button mat-flat-button class="color-primary" (click)="onLogoutClick()">
          <span>{{ I18N['Sign out'] }}</span>
        </button>
      </ng-template>
      <ng-template #nonAuthorizedUserButtons>
        <button mat-flat-button class="color-primary" (click)="onLoginClick()">
          <span>{{ I18N['Sign in'] }}</span>
        </button>
      </ng-template>
      <button mat-flat-button color="accent" (click)="toggleLanguage()">
        <span>{{ language === 'eng' ? 'Eng' : 'Укр' }}</span>
      </button>
    </div>
    <div class="app-content-wrapper">
      <ng-template [ngIf]="user$ | async" [ngIfElse]="nonAuthorizedUserView">
        <app-home></app-home>
      </ng-template>
      <ng-template #nonAuthorizedUserView>
        <div
          class="app-content app-card display-flex flex-direction-column align-items-center justify-content-center gap-5 p-2"
          style="
            background-color: rgba(0, 0, 0, 0.5);
            background-image: url('./assets/home-background.jpg');
            background-size: cover;
            background-blend-mode: darken;
          "
        >
          <img src="./assets/logo.svg" />
          <button
            mat-flat-button
            class="color-white:hover background-color-primary:hover"
            style="transition: color ease-in-out 0.2s, background-color ease-in-out 0.2s"
            (click)="onRegisterClick()"
          >
            <span>{{ I18N['Sign up'] }}</span>
          </button>
          <div class="text-align-center color-white" style="font-size: 1.5rem">
            <div class="mb-2">{{ I18N['Clean water is a healthy life.'] }}</div>
            <div>{{ I18N['Explore the river flows with us!'] }}</div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
})
export class AppComponent implements OnInit {
  public readonly I18N = I18N;

  public language: 'eng' | 'ukr';
  public user$!: Observable<User | null>;

  constructor(
    private matDialog: MatDialog,
    private apiClient: ApiClient,
    private notificationService: NotificationService
  ) {
    this.language = 'ukr';
  }

  toggleLanguage() {
    this.language = this.language === 'eng' ? 'ukr' : 'eng';
    changeLanguage(this.language);
  }

  public ngOnInit() {
    this.user$ = User.get$();
  }

  public onLoginClick() {
    this.openAuthorizationDialog();
  }
  public onRegisterClick() {
    this.openAuthorizationDialog({ register: true });
  }

  public onLogoutClick() {
    this.apiClient.authorization.logout().subscribe({
      next: () => {
        this.notificationService.notify('You are successfully signed out!');
        User.unset();
        localStorage.removeItem('token');
      },
    });
  }

  private openAuthorizationDialog(data?: any) {
    this.matDialog.open(AuthorizationComponent, {
      width: '400px',
      data,
    });
  }
}

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
