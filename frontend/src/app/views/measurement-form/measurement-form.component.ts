import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
];

import {
  ApiClient,
  LocationCRUDModel,
  SubstanceCRUDModel,
} from '@/features/api-client';
import { CallPipe } from '@/features/call-pipe';
import { I18N } from '@/features/i18n';
import { NotificationService } from '@/features/notification';

export type MeasurementFormData = {
  location: LocationCRUDModel['getEntitiesResult'];
  substances: SubstanceCRUDModel['getEntitiesResult'][];
};

export type MeasurementFormResult =
  | boolean
  | SubstanceCRUDModel['getEntitiesResult'][];

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES, CallPipe],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-measurement-form',
  template: `
    <form spellcheck="false" [formGroup]="formGroup">
      <div mat-dialog-title>{{ I18N['New Measurement'] }}</div>
      <div mat-dialog-content>
        <ng-container formGroupName="values">
          <mat-form-field
            *ngFor="let field of SUBSTANCES_FIELDS_MODEL"
            class="width-full"
          >
            <mat-label>{{ field.label }}</mat-label>
            <input
              matInput
              type="number"
              [formControlName]="field.formControlName"
            />
            <mat-hint
              *ngIf="
                field.hint
                  | call
                    : formGroup.controls['values'].controls[
                        field.formControlName
                      ].value as message
              "
            >
              {{ message }}
            </mat-hint>
            <mat-error
              *ngIf="
                formGroup.controls['values'].controls[field.formControlName]
                  .errors as errors
              "
            >
              {{ errors['message'] }}
            </mat-error>
          </mat-form-field>
        </ng-container>
      </div>
      <div mat-dialog-actions class="justify-content-end g-2">
        <button
          mat-flat-button
          color="primary"
          type="submit"
          [disabled]="formGroup.invalid || isFormSubmitted"
          (click)="onSubmitClick()"
        >
          {{ I18N['Submit'] }}
        </button>
        <button mat-flat-button [mat-dialog-close]="false">
          {{ I18N['Close'] }}
        </button>
      </div>
    </form>
  `,
})
export class MeasurementFormComponent implements OnInit {
  public readonly I18N = I18N;
  private readonly FORM_BUILDER = new FormBuilder();
  public readonly formGroup;
  public isFormSubmitted: boolean;

  public SUBSTANCES_FIELDS_MODEL!: {
    formControlName: string;
    label: string;
    hint: (value: number) => string | null;
  }[];

  constructor(
    private dialogRef: MatDialogRef<
      MeasurementFormComponent,
      MeasurementFormResult
    >,
    @Inject(MAT_DIALOG_DATA)
    private data: MeasurementFormData,
    private notificationService: NotificationService,
    private apiClient: ApiClient
  ) {
    this.formGroup = this.FORM_BUILDER.group({
      locationId: this.FORM_BUILDER.control<number | null>(null),
      values: this.FORM_BUILDER.group<{ [key: string]: FormControl }>({}),
    });
    this.isFormSubmitted = false;
  }

  public ngOnInit() {
    this.formGroup.patchValue({
      locationId: this.data.location.id,
    });

    this.SUBSTANCES_FIELDS_MODEL = this.data.location.substances_ids.map(
      (id) => {
        const substance = this.data.substances.find((item) => item.id === id)!;
        this.formGroup.controls['values'].addControl(
          id.toString(),
          this.FORM_BUILDER.control(
            substance.min_value,
            (control: AbstractControl) => {
              if (control.value == null || Number.isNaN(+control.value)) {
                return { message: I18N['Measurement must be a number.'] };
              } else if (control.value < substance.min_value) {
                return {
                  message: I18N[
                    'Measurement must be greater or equal to $number.'
                  ](substance.min_value),
                };
              }
              return null;
            }
          )
        );
        return {
          formControlName: id.toString(),
          label: substance.name,
          hint: (value: number) =>
            value > substance.max_value
              ? I18N['Maximum value exceeding: $number'](substance.max_value)
              : null,
        };
      }
    );
  }

  public onSubmitClick() {
    if (this.formGroup.invalid || this.isFormSubmitted) return;
    const value = this.formGroup.value;
    this.isFormSubmitted = true;
    this.apiClient.measurement.postEntity(value).subscribe({
      next: () => {
        this.notificationService.notify(
          I18N['Measurement is successfully added.']
        );
        const substances = Object.entries(value.values!).reduce(
          (accumulator, [key, value]) => {
            const substance = this.data.substances.find(
              (item) => item.id == (key as any)
            )!;
            if (value > substance.max_value) {
              accumulator.push(substance);
            }
            return accumulator;
          },
          [] as SubstanceCRUDModel['getEntitiesResult'][]
        );
        this.dialogRef.close(substances.length ? substances : true);
      },
      error: () => {
        this.isFormSubmitted = false;
      },
    });
  }
}
