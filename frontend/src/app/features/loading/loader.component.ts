import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LOADING$$ } from './loader.models';

const MATERIAL_MODULES = [MatProgressSpinnerModule];

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-loader',
  template: `
    <div *ngIf="LOADING$ | async" class="overlay">
      <mat-spinner diameter="50" strokeWidth="2"></mat-spinner>
    </div>
  `,
  styles: [
    `
      .overlay {
        position: absolute;
        top: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 9999;
      }
    `,
  ],
})
export class LoaderComponent {
  public LOADING$: Observable<boolean> = LOADING$$;
}
