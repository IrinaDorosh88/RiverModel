import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-description',
  template: `
        <div
          class="height-full display-flex align-items-center justify-content-center"
          style="flex: 1; font-size: 2rem;color: white; background-color: red"
        >
          Description HERE
        </div>
  `,
})
export class DescriptionComponent {}
