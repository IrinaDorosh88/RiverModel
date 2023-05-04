import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
  | SubstanceCRUDModel['getPaginatedEntitiesResult']['data'][number]
  | undefined
  | null;

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  selector: 'app-substance-form',
  template: `
    <form spellcheck="false" [formGroup]="FORM_GROUP">
      <div mat-dialog-title>{{ TITLE }}</div>
      <div mat-dialog-content>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Name'] }}</mat-label>
          <input matInput formControlName="name" />
          <mat-error *ngIf="FORM_GROUP.controls['name'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Min'] }}</mat-label>
          <input matInput type="number" formControlName="min" [attr.min]="0" />
          <mat-error *ngIf="FORM_GROUP.controls['min'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Max'] }}</mat-label>
          <input
            matInput
            type="number"
            formControlName="max"
            [attr.min]="FORM_GROUP.controls['min'].value"
          />
          <mat-error *ngIf="FORM_GROUP.controls['max'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Unit'] }}</mat-label>
          <input matInput formControlName="unit" />
          <mat-error *ngIf="FORM_GROUP.controls['unit'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
      </div>
      <div mat-dialog-actions class="justify-content-end gap-2">
        <button
          mat-flat-button
          [color]="SUBMIT_BUTTON_COLOR"
          type="submit"
          [disabled]="FORM_GROUP.invalid || isFormSubmitted"
          (click)="onSubmitClick()"
        >
        {{ I18N['Submit'] }}
        </button>
        <button mat-flat-button [mat-dialog-close]="false">{{ I18N['Close'] }}</button>
      </div>
    </form>
  `,
})
export class SubstanceFormComponent implements OnInit {
  public readonly I18N = I18N;

  public readonly FORM_GROUP;
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
    this.FORM_GROUP = fb.group(
      {
        name: fb.control(''),
        min: fb.control(0),
        max: fb.control(0),
        unit: fb.control(''),
      },
      {
        validators: (formGroup: FormGroup) => {
          const { name, min, max, unit } = formGroup.controls;
          // Name
          if (name.value === '') {
            name.setErrors({ message: I18N['Name is required.'] });
          } else {
            name.setErrors(null);
          }
          // Min
          let minValue = min.value;
          if (min.value == null || Number.isNaN(+min.value)) {
            min.setErrors({ message: I18N['Min must be a number.'] });
            minValue = 0;
          } else if (min.value < 0) {
            min.setErrors({ message: I18N['Min must be greater or equal to 0.'] });
            minValue = 0;
          } else {
            min.setErrors(null);
          }
          // Max
          if (max.value == null || Number.isNaN(+max.value)) {
            max.setErrors({ message: I18N['Max must be a number.'] });
          } else if (max.value < minValue) {
            max.setErrors({
              message: I18N['Min must be greater or equal to $value.'](minValue),
            });
          } else {
            max.setErrors(null);
          }
          // Unit
          if (unit.value === '') {
            unit.setErrors({ message: I18N['Unit is required.'] });
          } else {
            unit.setErrors(null);
          }
        },
      }
    );
    this.isFormSubmitted = false;
  }

  public ngOnInit() {
    if (this.data) {
      this.FORM_GROUP.patchValue(this.data);
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
    if (this.FORM_GROUP.invalid || this.isFormSubmitted) return;

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
    const value = this.FORM_GROUP.value;
    return this.apiClient.substance.postEntity(value).pipe(
      tap(() => {
        this.notificationService.notify(
          I18N['$name substance is successfully created.'](value.name)
        );
      })
    );
  }

  private patchEntity() {
    const value = this.FORM_GROUP.value;
    return this.apiClient.substance.patchEntity(this.data!.id, value).pipe(
      tap(() => {
        this.notificationService.notify(
          I18N['$name substance is successfully edited.'](value.name)
        );
      })
    );
  }
}
