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
    <mat-toolbar class="gap-2 width-auto m-3" style="border-radius: 1rem">
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
    <div class="text-align-center p-5">Chart Page</div>
  `,
})
export class ChartComponent {}
