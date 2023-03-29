import { Component } from '@angular/core';

import { RiversComponent } from './rivers';
import { SubstancesComponent } from './substances';
const VIEWS = [RiversComponent, SubstancesComponent];

@Component({
  standalone: true,
  imports: [...VIEWS],
  selector: 'app-rivers-and-substances',
  template: `
    <div class="height-full p-5 display-flex flex-wrap gap-5 overflow-y-auto">
      <div
        class="card-box-shadow p-2 background-color-white"
        style="flex: 2;"
      >
        <app-rivers></app-rivers>
      </div>
      <div
        class="card-box-shadow p-2 background-color-white"
        style="flex: 3;"
      >
        <app-substances></app-substances>
      </div>
    </div>
  `,
})
export class RiversAndSubstancesComponent {}
