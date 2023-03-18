import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationConfig } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
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

import { AuthorizationService } from '@app/features/authorization';
import { User, USER_INITIALIZER } from '@app/features/user';
import { APP_VIEWS, HomeComponent, AuthorizationComponent } from '@app/views';
import { ENVIRONMENT_INITIALIZER } from '@app/features/environment-init';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ...MATERIAL_MODULES, ...APP_VIEWS],
  selector: 'app-root',
  template: `
    <mat-toolbar class="gap-3 flex-shrink-0" color="primary">
      <span class="primary">LOGO HERE</span>
      <div class="flex-auto"></div>
      <ng-container *ngIf="user$ | async; else nonAuthorized">
        <button mat-button (click)="onLogoutClick()">
          <span>Sign out</span>
        </button>
      </ng-container>
      <ng-template #nonAuthorized>
        <button mat-button (click)="onLoginClick()">
          <span>Sign in</span>
        </button>
        <button mat-button (click)="onRegisterClick()">
          <span>Sign up</span>
        </button>
      </ng-template>
    </mat-toolbar>
    <div class="flex-auto">
      <router-outlet></router-outlet>
    </div>
  `,
  host: { class: 'height-full display-flex flex-column' },
})
export class AppComponent implements OnInit {
  public user$!: Observable<User | undefined>;

  constructor(
    private dialog: MatDialog,
    private authorizationService: AuthorizationService
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
      next: (next) => {
        console.log(next);
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

const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
];

export const APP_CONFIG: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(APP_ROUTES),
    provideHttpClient(),
    ENVIRONMENT_INITIALIZER,
    USER_INITIALIZER,
  ],
};
