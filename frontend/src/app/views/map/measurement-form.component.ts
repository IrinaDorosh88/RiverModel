import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { tap } from 'rxjs';

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

import { LocationCRUDModel, ApiClient } from '@/features/api-client';
import { NotificationService } from '@/features/notification';

export type MeasurementFormData = {
  location: LocationCRUDModel['getEntitiesResult'][number];
  mapper: { [key: string]: string };
};

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  selector: 'app-measurement-form',
  template: `
    <form spellcheck="false" [formGroup]="FORM_GROUP">
      <div mat-dialog-title>New Measurement</div>
      <div mat-dialog-content>
        <mat-form-field class="width-full">
          <mat-label>Date</mat-label>
          <input
            matInput
            formControlName="date"
            [matDatepicker]="picker"
            [max]="CURRENT_DATE"
          />
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
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
            <mat-error
              *ngIf="
                FORM_GROUP.controls['values'].controls[field.formControlName]
                  .errors as errors
              "
            >
              {{ errors['message'] }}
            </mat-error>
          </mat-form-field>
        </ng-container>
      </div>
      <div mat-dialog-actions class="justify-content-end gap-2">
        <button
          mat-flat-button
          color="primary"
          type="submit"
          [disabled]="FORM_GROUP.invalid || isFormSubmitted"
          (click)="onSubmitClick()"
        >
          Submit
        </button>
        <button mat-flat-button [mat-dialog-close]="false">Close</button>
      </div>
    </form>
  `,
})
export class MeasurementFormComponent implements OnInit {
  public readonly CURRENT_DATE;
  private readonly FORM_BUILDER: FormBuilder;
  public readonly FORM_GROUP;
  public isFormSubmitted;

  public SUBSTANCES_FIELDS_MODEL!: {
    formControlName: string;
    label: string;
  }[];

  constructor(
    private dialogRef: MatDialogRef<MeasurementFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: MeasurementFormData,
    private notificationService: NotificationService,
    private apiClient: ApiClient
  ) {
    this.CURRENT_DATE = new Date();
    this.FORM_BUILDER = new FormBuilder();
    this.FORM_GROUP = this.FORM_BUILDER.group({
      locationId: this.FORM_BUILDER.control<number | null>(null),
      date: this.FORM_BUILDER.control<Date | null>(null),
      values: this.FORM_BUILDER.group<{ [key: string]: FormControl }>({}),
    });
    this.isFormSubmitted = false;
  }

  public ngOnInit() {
    this.FORM_GROUP.patchValue({
      date: this.CURRENT_DATE,
      locationId: this.data.location.id,
    });
    const validator = (control: AbstractControl) => {
      if (control.value == null || Number.isNaN(+control.value)) {
        return { message: 'Must be a number.' };
      } else if (control.value < 0) {
        return { message: 'Must be greater or equal to 0.' };
      }
      return null;
    };

    this.SUBSTANCES_FIELDS_MODEL = this.data.location.substancesIds.map(
      (item) => {
        this.FORM_GROUP.controls['values'].addControl(
          item.toString(),
          this.FORM_BUILDER.control(0, validator)
        );
        return {
          formControlName: item.toString(),
          label: this.data.mapper[item],
        };
      }
    );
  }

  public onSubmitClick() {
    if (this.FORM_GROUP.invalid || this.isFormSubmitted) return;

    this.isFormSubmitted = true;
    this.postEntity().subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.isFormSubmitted = false;
      },
    });
  }

  private postEntity() {
    const value = this.FORM_GROUP.value;
    return this.apiClient.measurement.postEntity(value).pipe(
      tap(() => {
        this.notificationService.notify(`Measurement is successfully added!`);
      })
    );
  }
}
