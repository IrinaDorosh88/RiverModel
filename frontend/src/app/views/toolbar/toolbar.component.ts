import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
const MATERIAL_MODULES = [MatButtonModule, MatIconModule, MatToolbarModule];

import { HOME_CURRENT_TAB$$ } from '@app/views/home';

import { TOOLBAR_ACTION$$ } from './toolbar.model';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-toolbar',
  template: `
    <div
      class="p-3 display-flex gap-2"
      style="min-height: 5rem"
      [ngSwitch]="HOME_CURRENT_TAB$$ | async"
    >
      <ng-container *ngSwitchCase="0">
        <button
          mat-flat-button
          color="primary"
          (click)="onToolbarActionInvoked('NEW_RIVER')"
        >
          <mat-icon>add</mat-icon>
          River
        </button>
        <button
          mat-flat-button
          color="primary"
          (click)="onToolbarActionInvoked('NEW_SUBSTANCE')"
        >
          <mat-icon>add</mat-icon>
          Substance
        </button>
      </ng-container>
      <ng-container *ngSwitchCase="1"></ng-container>
      <ng-container *ngSwitchCase="2"></ng-container>
    </div>
  `,
})
export class ToolbarComponent {
  HOME_CURRENT_TAB$$ = HOME_CURRENT_TAB$$;

  public onToolbarActionInvoked(key: string, ...params: any[]) {
    TOOLBAR_ACTION$$.next({ key, params });
  }
}
