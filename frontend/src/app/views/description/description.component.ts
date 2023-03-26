import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-description',
  template: `
    <div class="height-full p-5">
      <div
        class="height-full display-flex align-items-center justify-content-center"
        style="border: 0.5rem solid #fff; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; font-size: 2rem; color: white; background-color: red"
      >
        Description HERE
      </div>
    </div>
  `,
})
export class DescriptionComponent {}
