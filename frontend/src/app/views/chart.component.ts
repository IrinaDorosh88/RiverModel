import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

const MATERIAL_MODULES: any[] = [];

import { HOME_TOOLBAR_ACTION$$ } from './home.component';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-chart',
  template: `
    <div
      class="height-full p-5 display-flex flex-wrap gap-5"
      style="overflow-y: auto;"
    >
      <div
        class="height-full"
        style="flex: 3; border: 0.5rem solid #fff; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;"
      >
        <div
          class="height-full display-flex align-items-center justify-content-center"
          style="font-size: 2rem; color: white; background-color: green"
        >
          Chart HERE
        </div>
      </div>
      <div
        class="height-full"
        style="flex: 2; border: 0.5rem solid #fff; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;"
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
  private readonly HOME_TOOLBAR_ACTION_MAPPER: {
    [key: string]: (...params: any[]) => void;
  } = {
    CREATE: this.onCreateClick.bind(this),
  };

  public ngOnInit() {
    this.subscription = HOME_TOOLBAR_ACTION$$.subscribe({
      next: ({ key, params }) =>
        this.HOME_TOOLBAR_ACTION_MAPPER[key](...params),
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
