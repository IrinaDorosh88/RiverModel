import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-description',
  template: `
    <div class="height-full p-5">
      <div
        class="card-box-shadow height-full display-flex align-items-center justify-content-center"
        style="border: 0.5rem solid #fff; font-size: 2rem; color: white; background-color: #00f"
      >
        Description HERE
      </div>
    </div>
  `,
})
export class DescriptionComponent {}
