import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

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

import { ApiClient, LocationCRUDModel } from '@/features/api-client';
import { CallPipe } from '@/features/call-pipe';
import { I18N } from '@/features/i18n';
import { NotificationService } from '@/features/notification';

export type MeasurementFormData = {
  location: LocationCRUDModel['getEntitiesResult'];
};

export type MeasurementFormResult =
  | boolean
  | LocationCRUDModel['getEntitiesResult']['chemical_elements'];

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES, CallPipe],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-measurement-form',
  template: `
    <form spellcheck="false" [formGroup]="formGroup">
      <div mat-dialog-title>{{ I18N['New Measurement'] }}</div>
      <div mat-dialog-content>
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
                  : formGroup.controls[field.formControlName].value as message
            "
          >
            {{ message }}
          </mat-hint>
          <mat-error
            *ngIf="formGroup.controls[field.formControlName].errors as errors"
          >
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
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
  public readonly formGroup: FormGroup<{
    [key: string]: FormControl<number>;
  }>;
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
    this.formGroup = new FormGroup({});
    this.isFormSubmitted = false;
  }

  public ngOnInit() {
    this.SUBSTANCES_FIELDS_MODEL = this.data.location.chemical_elements.map(
      (item) => {
        this.formGroup.addControl(
          item.id.toString(),
          new FormControl(item.min_value, (control: AbstractControl) => {
            if (control.value == null || Number.isNaN(+control.value)) {
              return { message: I18N['Measurement must be a number.'] };
            } else if (control.value < item.min_value) {
              return {
                message: I18N[
                  'Measurement must be greater or equal to $number.'
                ](item.min_value),
              };
            }
            return null;
          }) as FormControl<number>
        );
        return {
          formControlName: item.id.toString(),
          label: item.name,
          hint: (value: number) =>
            value > item.max_value
              ? I18N['Maximum value exceeding: $number'](item.max_value)
              : null,
        };
      }
    );
  }

  public onSubmitClick() {
    if (this.formGroup.invalid || this.isFormSubmitted) return;
    const value = {
      location_id: this.data.location.id,
      values: Object.entries(this.formGroup.value).map(([key, value]) => ({
        chemical_element_id: key,
        concentration_value: value,
      })),
    };
    this.isFormSubmitted = true;
    this.apiClient.measurement.postEntity(value).subscribe({
      next: () => {
        this.notificationService.notify(
          I18N['Measurement is successfully added.']
        );
        const substances = value.values.reduce((accumulator, item) => {
          const substance = this.data.location.chemical_elements.find(
            (chemical_element) =>
              `${chemical_element.id}` === item.chemical_element_id
          )!;
          if (item.concentration_value! > substance.max_value) {
            accumulator.push(substance);
          }
          return accumulator;
        }, [] as LocationCRUDModel['getEntitiesResult']['chemical_elements']);
        this.dialogRef.close(substances.length ? substances : true);
      },
      error: (error: HttpErrorResponse) => {
        this.isFormSubmitted = false;
        switch (error.status) {
          case HttpStatusCode.UnprocessableEntity:
            this.notificationService.notify(I18N['Validaton error.']);
            break;
          case HttpStatusCode.InternalServerError:
            this.notificationService.notify(I18N['Internal server error.']);
            break;
          default:
            this.notificationService.notify(I18N['Something went wrong.']);
        }
      },
    });
  }
}
