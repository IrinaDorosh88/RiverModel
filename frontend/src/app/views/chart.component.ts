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
  selector: 'app-chart',
  template: `
    <div class="height-full display-flex flex-direction-column">
      <mat-toolbar class="gap-2 width-auto m-3" style="border-radius: 1rem">
        <button
          mat-mini-fab
          color="primary"
          class="mr-auto"
          style="border-radius: 1rem;"
        >
          <mat-icon>add</mat-icon>
        </button>
      </mat-toolbar>
      <div class="flex-auto display-flex flex-wrap flex-wrap">
        <div
          class="display-flex align-items-center justify-content-center"
          style="flex: 3; font-size: 2rem;color: white; background-color: green"
        >
          Chart HERE
        </div>
        <div
          class="display-flex align-items-center justify-content-center"
          style="flex: 2; font-size: 2rem; color: white; background-color: blue"
        >
          Calculations HERE
        </div>
      </div>
    </div>
  `,
})
export class ChartComponent {}
