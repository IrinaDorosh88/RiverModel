import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-description',
  template: `
    <div
      class="app-content app-card"
      style="display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white; background-color: #00f"
    >
      Description HERE
    </div>
  `,
})
export class DescriptionComponent {}
