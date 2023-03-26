import { Component } from '@angular/core';

import { RiversComponent } from '@app/views/rivers';
import { SubstancesComponent } from '@app/views/substances';
const VIEWS = [RiversComponent, SubstancesComponent];

@Component({
  standalone: true,
  imports: [...VIEWS],
  selector: 'app-rivers-and-substances',
  template: `
    <div class="height-full p-5 display-flex flex-wrap gap-5 overflow-y-auto">
      <div
        class="height-full p-2 background-color-white"
        style="flex: 2; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;"
      >
        <app-rivers></app-rivers>
      </div>
      <div
        class="height-full p-2 background-color-white"
        style="flex: 3; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;"
      >
        <app-substances></app-substances>
      </div>
    </div>
  `,
})
export class RiversAndSubstancesComponent {}
