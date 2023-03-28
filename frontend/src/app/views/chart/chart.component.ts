import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

const MATERIAL_MODULES: any[] = [];

import { TOOLBAR_ACTION$$ } from '@app/views/toolbar';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-chart',
  template: `
    <div class="height-full p-5 display-flex flex-wrap gap-5 overflow-y-auto">
      <div
        class="card-box-shadow p-2 background-color-white"
        style="flex: 3;"
      >
        <div
          class="height-full display-flex align-items-center justify-content-center"
          style="font-size: 2rem; color: white; background-color: green"
        >
          Chart HERE
        </div>
      </div>
      <div
        class="card-box-shadow p-2 background-color-white"
        style="flex: 2;"
      >
        <div
          class="height-full display-flex align-items-center justify-content-center"
          style="font-size: 2rem; color: white; background-color: blue"
        >
          Calculations HERE
        </div>
      </div>
    </div>
  `,
})
export class ChartComponent {
  private readonly TOOLBAR_ACTION_MAPPER: {
    [key: string]: (...params: any[]) => void;
  } = {
    CREATE: this.onCreateClick.bind(this),
  };

  public ngOnInit() {
    this.subscription = TOOLBAR_ACTION$$.subscribe({
      next: ({ key, params }) => this.TOOLBAR_ACTION_MAPPER[key](...params),
    });
  }

  private subscription!: Subscription;
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private onCreateClick() {
    console.log('Hello from Chart!');
  }
}
