import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

const MATERIAL_MODULES: any[] = [];

import { HOME_TOOLBAR_ACTION$$ } from './home.component';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-map',
  template: `
    <div class="height-full display-flex flex-wrap">
      <div
        class="display-flex align-items-center justify-content-center"
        style="flex: 3; font-size: 2rem; color: white; background-color: blue"
      >
        Map HERE
      </div>
      <div
        class="display-flex align-items-center justify-content-center"
        style="flex: 2; font-size: 2rem; color: white; background-color: red"
      >
        Markers HERE
      </div>
    </div>
  `,
})
export class MapComponent {
  private readonly HOME_TOOLBAR_ACTION_MAPPER: {
    [key: string]: (...params: any) => void;
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
    console.log('Hello from Map!');
  }
}
