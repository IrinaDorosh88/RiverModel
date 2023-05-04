import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, tap } from 'rxjs';

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

import {
  ApiClient,
  LocationCRUDModel,
  RiverCRUDModel,
  SubstanceCRUDModel,
} from '@/features/api-client';
import { I18N } from '@/features/i18n';
import { NotificationService } from '@/features/notification';

export type LocationFormData =
  | {
      entity: LocationCRUDModel['getPaginatedEntitiesResult'][number];
    }
  | {
      entity?: undefined;
      coordinates: { latitude: number; longitude: number };
      riverId?: number | null;
    };

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  selector: 'app-location-form',
  template: `
    <form spellcheck="false" [formGroup]="FORM_GROUP">
      <div mat-dialog-title>{{ TITLE }}</div>
      <div mat-dialog-content>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Latitude'] }}</mat-label>
          <input matInput formControlName="latitude" />
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Longitude'] }}</mat-label>
          <input matInput formControlName="longitude" />
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Substances'] }}</mat-label>
          <mat-select multiple formControlName="substancesIds">
            <mat-option
              *ngFor="let entity of SUBSTANCES$ | async"
              [value]="entity.id"
            >
              {{ entity.name }}
            </mat-option>
          </mat-select>
          <mat-error
            *ngIf="FORM_GROUP.controls['substancesIds'].errors as errors"
          >
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['River'] }}</mat-label>
          <mat-select formControlName="riverId">
            <mat-option [value]="null">---</mat-option>
            <mat-option
              *ngFor="let entity of RIVERS$ | async"
              [value]="entity.id"
            >
              {{ entity.name }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="FORM_GROUP.controls['riverId'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>

        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Name'] }}</mat-label>
          <input matInput formControlName="name" />
          <mat-error *ngIf="FORM_GROUP.controls['name'].errors as errors">
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
        <button mat-flat-button [mat-dialog-close]="false">
          {{ I18N['Close'] }}
        </button>
      </div>
    </form>
  `,
})
export class LocationFormComponent implements OnInit {
  public readonly I18N = I18N;
  public readonly FORM_GROUP;
  public isFormSubmitted;

  public TITLE!: string;
  public SUBMIT_BUTTON_COLOR!: 'primary' | 'accent';
  private HANDLE_ENTITY!: () => Observable<any>;
  public RIVERS$!: Observable<
    RiverCRUDModel['getPaginatedEntitiesResult']['data']
  >;
  public SUBSTANCES$!: Observable<
    SubstanceCRUDModel['getPaginatedEntitiesResult']['data']
  >;

  constructor(
    private dialogRef: MatDialogRef<LocationFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: LocationFormData,
    private notificationService: NotificationService,
    private apiClient: ApiClient
  ) {
    const fb = new FormBuilder();
    this.FORM_GROUP = fb.group(
      {
        latitude: fb.control({ value: null, disabled: true }),
        longitude: fb.control({ value: null, disabled: true }),
        name: fb.control(''),
        riverId: fb.control(null),
        substancesIds: fb.control(''),
      },
      {
        validators: (formGroup: FormGroup) => {
          const { name, riverId, substancesIds } = formGroup.controls;
          // Name
          if (name.value === '') {
            name.setErrors({ message: I18N['Name is required.'] });
          } else {
            name.setErrors(null);
          }
          // River Id
          if (riverId.value == null) {
            riverId.setErrors({ message: I18N['River is required.'] });
          } else {
            riverId.setErrors(null);
          }
          // Substances
          if (!(substancesIds.value && substancesIds.value.length)) {
            substancesIds.setErrors({
              message: I18N['Choose at least one substance.'],
            });
          } else {
            substancesIds.setErrors(null);
          }
        },
      }
    );
    this.isFormSubmitted = false;
  }

  public ngOnInit() {
    this.SUBSTANCES$ = this.apiClient.substance
      .getPaginatedEntities()
      .pipe(map((next) => next.data));
    this.RIVERS$ = this.apiClient.river
      .getPaginatedEntities()
      .pipe(map((next) => next.data));
    if (this.data.entity) {
      this.FORM_GROUP.patchValue(this.data.entity);
      this.TITLE = I18N['Edit $name location'](this.data.entity.name);
      this.SUBMIT_BUTTON_COLOR = 'accent';
      this.HANDLE_ENTITY = this.patchEntity;
      this.FORM_GROUP.controls['substancesIds'].disable();
    } else {
      this.FORM_GROUP.patchValue(this.data.coordinates);
      if (this.data.riverId) {
        this.FORM_GROUP.controls['riverId'].patchValue(this.data.riverId);
      }
      this.TITLE = I18N['New Location'];
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
    return this.apiClient.location.postEntity(value).pipe(
      tap(() => {
        this.notificationService.notify(
          I18N['$name location is successfully created.'](value.name)
        );
      })
    );
  }

  private patchEntity() {
    const value = this.FORM_GROUP.value;
    return this.apiClient.location
      .patchEntity(this.data!.entity!.id, value)
      .pipe(
        tap(() => {
          this.notificationService.notify(
            I18N['$name location is successfully edited.'](value.name)
          );
        })
      );
  }
}
