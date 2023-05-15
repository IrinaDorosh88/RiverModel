import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

const MATERIAL_MODULES = [] as any;

import { MeasurementCRUDModel } from '@/features/api-client';

export type LocationCurrentStateData = {
  measurement: MeasurementCRUDModel['getEntitiesResult'];
  excesses: MeasurementCRUDModel['getEntitiesResult']['measurements'];
};

export type LocationCurrentStateResult = number;

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-current-state',
  standalone: true,
  template: `Hello?`,
})
export class LocationCurrentStateComponent {}
