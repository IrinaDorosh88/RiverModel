import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatTabsModule,
  MatToolbarModule,
];

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-home',
  template: `
    <div
      class="height-full display-flex flex-direction-column gap-3 mx-auto"
      style="max-width: 1000px"
    >
      <mat-toolbar class="gap-2" style="border-radius: 1rem">
        <button
          mat-mini-fab
          color="primary"
          class="mr-auto"
          style="border-radius: 1rem;"
        >
          <mat-icon>add</mat-icon>
        </button>
        <button mat-mini-fab color="accent">
          <mat-icon>plus_one</mat-icon>
        </button>
        <button mat-mini-fab color="accent">
          <mat-icon>plus_one</mat-icon>
        </button>
      </mat-toolbar>

      <mat-tab-group class="flex-auto" dynamicHeight>
        <mat-tab label="Map">
          <ng-template matTabContent> Map Content </ng-template>
        </mat-tab>
        <mat-tab label="Predictions">
          <ng-template matTabContent> Predictions Content </ng-template>
        </mat-tab>
        <mat-tab label="...">
          <ng-template matTabContent> ... Content </ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class HomeComponent {}
