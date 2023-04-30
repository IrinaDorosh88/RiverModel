import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationConfig } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
const MATERIAL_MODULES = [MatButtonModule, MatDialogModule, MatIconModule];

import { AuthorizationComponent } from '@/views/authorization';
import { DescriptionComponent } from '@/views/description';
import { HomeComponent } from '@/views/home';
const VIEWS = [AuthorizationComponent, DescriptionComponent, HomeComponent];

import { ApiClient } from '@/features/api-client';
import { ENVIRONMENT_INITIALIZER_PROVIDER } from '@/features/environment-init';
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
          <span>Sign out</span>
        </button>
      </ng-template>
      <ng-template #nonAuthorizedUserButtons>
        <button mat-flat-button class="color-primary" (click)="onLoginClick()">
          <span>Sign in</span>
        </button>
        <button mat-button class="color-white" (click)="onRegisterClick()">
          <span>Sign up</span>
        </button>
      </ng-template>
    </div>
    <div class="app-content-wrapper">
      <ng-template [ngIf]="user$ | async" [ngIfElse]="nonAuthorizedUserView">
        <app-home></app-home>
      </ng-template>
      <ng-template #nonAuthorizedUserView>
        <app-description></app-description>
      </ng-template>
    </div>
  `,
})
export class AppComponent implements OnInit {
  public user$!: Observable<User | undefined>;

  constructor(
    private matDialog: MatDialog,
    private apiClient: ApiClient,
    private notificationService: NotificationService
  ) {}

  public ngOnInit() {
    this.apiClient.authorization['httpClient'].get(`${this.apiClient.authorization['apiHost']}/`).subscribe({
      next: console.log,
    })
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
    provideHttpClient(withInterceptors([loaderInterceptorFn])),
    ENVIRONMENT_INITIALIZER_PROVIDER,
    USER_INITIALIZER_PROVIDER,
    ...NOTIFICATION_PROVIDERS,
    importProvidersFrom(MatDialogModule, MatNativeDateModule),
  ],
};
