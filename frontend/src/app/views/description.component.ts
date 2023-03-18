import { Component } from "@angular/core";

@Component({
  standalone: true,
  selector: 'app-description',
  template: ` Description `,
  host: { class: 'height-full display-flex align-items-center justify-content-center' },
})
export class DescriptionComponent {}
