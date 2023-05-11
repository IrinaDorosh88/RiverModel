import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
const MATERIAL_MODULES = [MatButtonModule, MatIconModule];

import { ApiClient } from '@/features/api-client';
import { changeLanguage, I18N } from '@/features/i18n';

import { NotificationService } from '@/features/notification';
import { User } from '@/features/user';

import { AuthorizationFormComponent } from '@/views/authorization-form';
import { HomeComponent } from '@/views/home';
const VIEWS = [AuthorizationFormComponent, HomeComponent];

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES, ...VIEWS],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-layout',
  template: `
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
      <button mat-flat-button color="accent" (click)="onToggleLanguageClick()">
        <span>{{ language === 'eng' ? 'Eng' : 'Укр' }}</span>
      </button>
    </div>
    <div class="app-content-wrapper">
      <ng-template [ngIf]="user$ | async" [ngIfElse]="nonAuthorizedUserView">
        <app-home></app-home>
      </ng-template>
      <ng-template #nonAuthorizedUserView>
        <div
          class="app-content app-card display-flex flex-direction-column align-items-center justify-content-center g-5 p-2"
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
export class LayoutComponent implements OnInit {
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

  public ngOnInit() {
    this.user$ = User.get$();
  }

  public onToggleLanguageClick() {
    this.language = this.language === 'eng' ? 'ukr' : 'eng';
    changeLanguage(this.language);
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
    this.matDialog.open(AuthorizationFormComponent, {
      width: '400px',
      data,
    });
  }
}
