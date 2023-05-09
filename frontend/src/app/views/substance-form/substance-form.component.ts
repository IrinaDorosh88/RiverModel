import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
];

import { SubstanceCRUDModel, ApiClient } from '@/features/api-client';
import { I18N } from '@/features/i18n';
import { NotificationService } from '@/features/notification';

export type SubstanceFormData =
  | SubstanceCRUDModel['getPaginatedEntitiesResult']
  | undefined
  | null;

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-substance-form',
  template: `
    <form spellcheck="false" [formGroup]="formGroup">
      <div mat-dialog-title>{{ TITLE }}</div>
      <div mat-dialog-content>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Name'] }}</mat-label>
          <input matInput formControlName="name" />
          <mat-error *ngIf="formGroup.controls['name'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Min'] }}</mat-label>
          <input
            matInput
            type="number"
            formControlName="min_value"
            [attr.min]="0"
          />
          <mat-error *ngIf="formGroup.controls['min_value'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Max'] }}</mat-label>
          <input
            matInput
            type="number"
            formControlName="max_value"
            [attr.min]="formGroup.controls['min_value'].value"
          />
          <mat-error *ngIf="formGroup.controls['max_value'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Unit'] }}</mat-label>
          <input matInput formControlName="units" />
          <mat-error *ngIf="formGroup.controls['units'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Time delta decay'] }}</mat-label>
          <input matInput type="number" formControlName="timedelta_decay" />
          <mat-error
            *ngIf="formGroup.controls['timedelta_decay'].errors as errors"
          >
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
      </div>
      <div mat-dialog-actions class="justify-content-end gap-2">
        <button
          mat-flat-button
          [color]="SUBMIT_BUTTON_COLOR"
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
export class SubstanceFormComponent implements OnInit {
  public readonly I18N = I18N;
  public readonly formGroup;
  public isFormSubmitted;
  public TITLE!: string;
  public SUBMIT_BUTTON_COLOR!: 'primary' | 'accent';
  private HANDLE_ENTITY!: () => Observable<any>;

  constructor(
    private dialogRef: MatDialogRef<SubstanceFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: SubstanceFormData,
    private notificationService: NotificationService,
    private apiClient: ApiClient
  ) {
    const fb = new FormBuilder();
    this.formGroup = fb.group(
      {
        max_value: fb.control(0),
        min_value: fb.control(0),
        name: fb.control(''),
        timedelta_decay: fb.control(0),
        units: fb.control(''),
      },
      {
        validators: (formGroup: FormGroup) => {
          const { max_value, min_value, name, timedelta_decay, units } =
            formGroup.controls;
          // Name
          if (name.value === '') {
            name.setErrors({ message: I18N['Name is required.'] });
          } else {
            name.setErrors(null);
          }
          // Min
          let minValue = min_value.value;
          if (min_value.value == null || Number.isNaN(+min_value.value)) {
            min_value.setErrors({ message: I18N['Min must be a number.'] });
            minValue = 0;
          } else if (min_value.value < 0) {
            min_value.setErrors({
              message: I18N['Min must be greater or equal to 0.'],
            });
            minValue = 0;
          } else {
            min_value.setErrors(null);
          }
          // Max
          if (max_value.value == null || Number.isNaN(+max_value.value)) {
            max_value.setErrors({ message: I18N['Max must be a number.'] });
          } else if (max_value.value < minValue) {
            max_value.setErrors({
              message:
                I18N['Min must be greater or equal to $value.'](minValue),
            });
          } else {
            max_value.setErrors(null);
          }
          // Units
          if (units.value === '') {
            units.setErrors({ message: I18N['Unit is required.'] });
          } else {
            units.setErrors(null);
          }

          // Timedelta Decay
          if (
            timedelta_decay.value == null ||
            Number.isNaN(+timedelta_decay.value)
          ) {
            timedelta_decay.setErrors({
              message: I18N['Min must be a number.'],
            });
            minValue = 0;
          } else if (timedelta_decay.value < 0) {
            timedelta_decay.setErrors({
              message: I18N['Min must be greater or equal to 0.'],
            });
            minValue = 0;
          } else {
            timedelta_decay.setErrors(null);
          }
        },
      }
    );
    this.isFormSubmitted = false;
  }

  public ngOnInit() {
    if (this.data) {
      this.formGroup.patchValue(this.data);
      this.TITLE = I18N['Edit $name substance'](this.data.name);
      this.SUBMIT_BUTTON_COLOR = 'accent';
      this.HANDLE_ENTITY = this.patchEntity;
    } else {
      this.TITLE = I18N['New Substance'];
      this.SUBMIT_BUTTON_COLOR = 'primary';
      this.HANDLE_ENTITY = this.postEntity;
    }
  }

  public onSubmitClick() {
    if (this.formGroup.invalid || this.isFormSubmitted) return;
    this.isFormSubmitted = true;
    this.HANDLE_ENTITY().subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.isFormSubmitted = false;
      },
    });
  }

  private postEntity() {
    const value = this.formGroup.value;
    return this.apiClient.substance.postEntity(value).pipe(
      tap(() => {
        this.notificationService.notify(
          I18N['$name substance is successfully created.'](value.name)
        );
      })
    );
  }

  private patchEntity() {
    const value = this.formGroup.value;
    return this.apiClient.substance.patchEntity(this.data!.id, value).pipe(
      tap(() => {
        this.notificationService.notify(
          I18N['$name substance is successfully edited.'](value.name)
        );
      })
    );
  }
}
