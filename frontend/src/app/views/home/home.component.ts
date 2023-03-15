import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  template: ` Home `,
  host: { class: 'h-full d-flex align-items-center justify-content-center' },
})
export class HomeComponent {}
