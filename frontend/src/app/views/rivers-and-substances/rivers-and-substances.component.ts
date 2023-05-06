import { Component, ViewEncapsulation } from '@angular/core';

import { RiversComponent } from '@/views/rivers';
import { SubstancesComponent } from '@/views/substances';
const VIEWS = [RiversComponent, SubstancesComponent];

@Component({
  standalone: true,
  imports: [...VIEWS],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-rivers-and-substances',
  template: `
    <div class="home-content app-card-container">
      <div class="app-card background-color-white" style="flex: 2;">
        <app-rivers></app-rivers>
      </div>
      <div class="app-card background-color-white" style="flex: 3;">
        <app-substances></app-substances>
      </div>
    </div>
  `,
})
export class RiversAndSubstancesComponent {}
