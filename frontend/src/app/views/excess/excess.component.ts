import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
const MATERIAL_MODULES = [MatButtonModule, MatDialogModule, MatIconModule];

import { LocationCRUDModel, SubstanceCRUDModel } from '@/features/api-client';

export type ExcessData = {
  substances: SubstanceCRUDModel['getEntitiesResult'][];
  location: LocationCRUDModel['getEntitiesResult'];
};

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-excess',
  standalone: true,
  template: ` {{ data | json }} `,
})
export class ExcessComponent {
  constructor(
    private dialogRef: MatDialogRef<ExcessComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ExcessData
  ) {}
}
