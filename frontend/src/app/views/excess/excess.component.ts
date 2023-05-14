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
import { I18N } from '@/features/i18n';

export type ExcessData = {
  substances: SubstanceCRUDModel['getEntitiesResult'][];
  location: LocationCRUDModel['getEntitiesResult'];
};

export type ExcessResult = number;

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-excess',
  standalone: true,
  template: `
    <div class="py-5 mx-auto text-align-center" style="max-width: 280px">
      <div class="mb-5">
        <mat-icon color="warn" style="transform: scale(2);">
          warning_amber
        </mat-icon>
      </div>
      <div class="mb-2 f-size-5">
        {{ I18N['PAY ATTENTION!'] }}
      </div>
      <div class="f-size-4">
        {{ I18N['Exceeding the norm!'] }}
      </div>
      <div class="p-3">
        <div class="mb-2 display-flex justify-content-space-between">
          <div class="p-2 f-weight-700">{{ I18N['River'] }}</div>
          <div class="p-2 user-select-none" style="background-color: #eee;">
            {{ data.location.river_name }}
          </div>
        </div>
        <div class="mb-2 display-flex justify-content-space-between">
          <div class="p-2 f-weight-700">{{ I18N['Location'] }}</div>
          <div class="p-2 user-select-none" style="background-color: #eee;">
            {{ data.location.name }}
          </div>
        </div>
        <div class="display-flex justify-content-space-between">
          <div class="p-2 f-weight-700">
            {{
              I18N[data.substances.length === 1 ? 'Substance' : 'Substances']
            }}
          </div>
          <div class="display-flex flex-direction-column g-2">
            <ng-template ngFor [ngForOf]="data.substances" let-item>
              <div
                class="p-2 cursor-pointer"
                style="background-color: #eee;"
                (click)="onSubstanceClick(item)"
              >
                {{ item.name }}
              </div>
            </ng-template>
          </div>
        </div>
      </div>
      <div class="mt-3 f-size-2">
        {{ I18N['* Click on a substance to display the graph.'] }}
      </div>
    </div>
  `,
})
export class ExcessComponent {
  public readonly I18N = I18N;
  constructor(
    private dialogRef: MatDialogRef<ExcessComponent, ExcessResult>,
    @Inject(MAT_DIALOG_DATA)
    public data: ExcessData
  ) {}

  public onSubstanceClick(entity: ExcessData['substances'][number]) {
    this.dialogRef.close(entity.id);
  }
}
