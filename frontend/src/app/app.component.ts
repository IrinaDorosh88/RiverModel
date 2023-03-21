import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationConfig } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatToolbarModule,
];

import { AuthorizationComponent } from '@app/views/authorization.component';
import { DescriptionComponent } from '@app/views/description.component';
import { HomeComponent } from '@app/views/home.component';
const VIEWS = [AuthorizationComponent, DescriptionComponent, HomeComponent];

import { AuthorizationService } from '@app/features/authorization';
import { ENVIRONMENT_INITIALIZER_PROVIDER } from '@app/features/environment-init';
import { LoaderComponent, loaderInterceptorFn } from '@app/features/loading';
import {
  NotificationService,
  NOTIFICATION_PROVIDERS,
} from '@app/features/notification';
import { User, USER_INITIALIZER_PROVIDER } from '@app/features/user';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES, LoaderComponent, ...VIEWS],
  selector: 'app-root',
  template: `
    <app-loader></app-loader>
    <div class="height-full display-flex flex-direction-column">
      <mat-toolbar class="gap-3 flex-shrink-0" color="primary">
        <span class="mr-auto">Logo HERE</span>
        <ng-template
          [ngIf]="user$ | async"
          [ngIfElse]="nonAuthorizedUserButtons"
        >
          <button mat-flat-button (click)="onLogoutClick()">
            <span>Sign out</span>
          </button>
        </ng-template>
        <ng-template #nonAuthorizedUserButtons>
          <button mat-flat-button (click)="onLoginClick()">
            <span>Sign in</span>
          </button>
          <button mat-button (click)="onRegisterClick()">
            <span>Sign up</span>
          </button>
        </ng-template>
      </mat-toolbar>
      <div class="flex-auto">
        <ng-template [ngIf]="user$ | async" [ngIfElse]="nonAuthorizedUserView">
          <app-home></app-home>
        </ng-template>
        <ng-template #nonAuthorizedUserView>
          <app-description></app-description>
        </ng-template>
      </div>
    </div>
  `,
})
export class AppComponent implements OnInit {
  public user$!: Observable<User | undefined>;

  constructor(
    private dialog: MatDialog,
    private authorizationService: AuthorizationService,
    private notificationService: NotificationService
  ) {}

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
    this.authorizationService.logout().subscribe({
      next: () => {
        this.notificationService.notify('You are successfully signed out!');
        User.unset();
        localStorage.removeItem('token');
      },
    });
  }

  private openAuthorizationDialog(data?: any) {
    this.dialog.open(AuthorizationComponent, {
      maxWidth: '400px',
      data,
    });
  }
}

export const APP_CONFIG: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(withInterceptors([loaderInterceptorFn])),
    ENVIRONMENT_INITIALIZER_PROVIDER,
    USER_INITIALIZER_PROVIDER,
    ...NOTIFICATION_PROVIDERS,
  ],
};
