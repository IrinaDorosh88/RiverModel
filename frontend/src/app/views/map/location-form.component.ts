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
import { MatSelectModule } from '@angular/material/select';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
];

import { LocationCRUDModel, LocationService } from '@app/features/api-client';
import { NotificationService } from '@app/features/notification';

export type LocationFormData =
  | {
      entity: LocationCRUDModel['getEntitiesResult'];
    }
  | {
      entity?: undefined;
      coordinates: { latitude: number; longitude: number };
      riverId?: number;
    };

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  selector: 'app-river-form',
  template: `
    <form spellcheck="false" [formGroup]="FORM_GROUP">
      <div mat-dialog-title>{{ TITLE }}</div>
      <div mat-dialog-content>
        <mat-form-field class="width-full">
          <mat-label>Latitude</mat-label>
          <input matInput type="number" formControlName="latitude" />
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>Longitude</mat-label>
          <input matInput type="number" formControlName="longitude" />
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          <mat-error *ngIf="FORM_GROUP.controls['name'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill" class="width-full">
          <mat-label>River</mat-label>
          <mat-select formControlName="riverId">
            <mat-option>---</mat-option>
            <mat-option [value]="1">River 1</mat-option>
            <mat-option [value]="2">River 2</mat-option>
            <mat-option [value]="3">River 3</mat-option>
          </mat-select>
          <mat-error *ngIf="FORM_GROUP.controls['riverId'].errors as errors">
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
export class LocationFormComponent implements OnInit {
  public readonly FORM_GROUP: FormGroup;

  public TITLE!: string;
  public SUBMIT_BUTTON_COLOR!: string;
  private HANDLE_ENTITY!: () => Observable<any>;

  public isFormSubmitted: boolean;

  constructor(
    private dialogRef: MatDialogRef<LocationFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: LocationFormData,
    private notificationService: NotificationService,
    private service: LocationService
  ) {
    const fb = new FormBuilder();
    this.FORM_GROUP = fb.group(
      {
        latitude: fb.control({ value: null, disabled: true }),
        longitude: fb.control({ value: null, disabled: true }),
        name: fb.control(''),
        riverId: fb.control(null),
      },
      {
        validators: (formGroup: FormGroup) => {
          const { name, riverId } = formGroup.controls;
          // Name
          if (name.value === '') {
            name.setErrors({ message: 'Name is required.' });
          } else {
            name.setErrors(null);
          }
          // River Id
          if (riverId.value == null) {
            riverId.setErrors({ message: 'River is required.' });
          } else {
            riverId.setErrors(null);
          }
        },
      }
    );
    this.isFormSubmitted = false;
  }

  public ngOnInit() {
    if (this.data.entity) {
      this.FORM_GROUP.patchValue(this.data.entity);
      this.TITLE = `Edit ${this.data.entity.name}`;
      this.SUBMIT_BUTTON_COLOR = 'accent';
      this.HANDLE_ENTITY = this.putEntity;
    } else {
      this.FORM_GROUP.patchValue(this.data.coordinates);
      if (this.data.riverId) {
        this.FORM_GROUP.controls['riverId'].patchValue(this.data.riverId);
      }
      this.TITLE = `New Location`;
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
    return this.service.putEntity(this.data.entity!.id, value).pipe(
      tap(() => {
        this.notificationService.notify(
          `${value.name} is successfully edited!`
        );
      })
    );
  }
}
