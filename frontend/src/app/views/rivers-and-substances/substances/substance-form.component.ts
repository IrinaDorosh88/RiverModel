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
const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
];

import { SubstanceCRUDModel, SubstanceService } from '@app/features/api-client';
import { NotificationService } from '@app/features/notification';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  selector: 'app-river-form',
  template: `
    <form spellcheck="false" [formGroup]="FORM_GROUP">
      <div mat-dialog-title>{{ TITLE }}</div>
      <div mat-dialog-content>
        <mat-form-field class="width-full">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          <mat-error *ngIf="FORM_GROUP.controls['name'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>Min</mat-label>
          <input matInput type="number" formControlName="min" [attr.min]="0" />
          <mat-error *ngIf="FORM_GROUP.controls['min'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>Max</mat-label>
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
          <mat-label>Unit</mat-label>
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
          Submit
        </button>
        <button mat-flat-button [mat-dialog-close]="false">Close</button>
      </div>
    </form>
  `,
})
export class SubstanceFormComponent implements OnInit {
  public readonly FORM_GROUP: FormGroup;
  public isFormSubmitted: boolean;

  public TITLE!: string;
  public SUBMIT_BUTTON_COLOR!: 'primary' | 'accent';
  private HANDLE_ENTITY!: () => Observable<any>;

  constructor(
    private dialogRef: MatDialogRef<SubstanceFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: SubstanceCRUDModel['getEntitiesResult'] | undefined,
    private notificationService: NotificationService,
    private service: SubstanceService
  ) {
    const fb = new FormBuilder();
    this.FORM_GROUP = fb.group(
      {
        name: fb.control('', (name) =>
          name.value === '' ? { message: 'Name is required.' } : null
        ),
        min: fb.control(0),
        max: fb.control(0),
        unit: fb.control('', (unit) =>
          unit.value === '' ? { message: 'Unit is required.' } : null
        ),
      },
      {
        validators: (formGroup: FormGroup) => {
          const { min, max } = formGroup.controls;
          // Min
          let minValue = min.value;
          if (min.value == null || Number.isNaN(+min.value)) {
            min.setErrors({ message: 'Min must be a number.' });
            minValue = 0;
          } else if (min.value < 0) {
            min.setErrors({ message: 'Min must be greater or equal to 0.' });
            minValue = 0;
          }
          // Max
          if (max.value == null || Number.isNaN(+max.value)) {
            max.setErrors({ message: 'Max must be a number.' });
          } else if (max.value < minValue) {
            max.setErrors({
              message: `Min must be greater or equal to ${minValue}.`,
            });
          }
        },
      }
    );
    this.isFormSubmitted = false;
  }

  public ngOnInit() {
    if (this.data) {
      this.FORM_GROUP.patchValue(this.data);
      this.TITLE = `Edit ${this.data.name}`;
      this.SUBMIT_BUTTON_COLOR = 'accent';
      this.HANDLE_ENTITY = this.putEntity;
    } else {
      this.TITLE = `New Substance`;
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
    return this.service.postEntity(value).pipe(
      tap(() => {
        this.notificationService.notify(
          `${value.name} is successfully created!`
        );
      })
    );
  }

  private putEntity() {
    const value = this.FORM_GROUP.value;
    return this.service.putEntity(this.data!.id, value).pipe(
      tap(() => {
        this.notificationService.notify(
          `${value.name} is successfully edited!`
        );
      })
    );
  }
}
