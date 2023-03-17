import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  template: ` Home `,
  host: { class: 'height-full display-flex align-items-center justify-content-center' },
})
export class HomeComponent {}
