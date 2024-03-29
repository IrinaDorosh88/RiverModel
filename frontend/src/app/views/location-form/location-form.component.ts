import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
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
      entity: LocationCRUDModel['getEntitiesResult'];
    }
  | {
      entity?: undefined;
      coordinates: { latitude: number; longitude: number };
      riverId?: number | null;
    };

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-location-form',
  template: `
    <form spellcheck="false" [formGroup]="formGroup">
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
          <mat-label>{{ I18N['River'] }}</mat-label>
          <mat-select formControlName="river_id">
            <mat-option [value]="null">---</mat-option>
            <mat-option
              *ngFor="let entity of RIVERS$ | async"
              [value]="entity.id"
            >
              {{ entity.name }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="formGroup.controls['river_id'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Name'] }}</mat-label>
          <input matInput formControlName="name" />
          <mat-error *ngIf="formGroup.controls['name'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Substances'] }}</mat-label>
          <mat-select multiple formControlName="chemical_elements">
            <mat-option
              *ngFor="let entity of SUBSTANCES$ | async"
              [value]="entity.id"
            >
              {{ entity.name }}
            </mat-option>
          </mat-select>
          <mat-error
            *ngIf="formGroup.controls['chemical_elements'].errors as errors"
          >
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Flow rate'] }}</mat-label>
          <input matInput type="number" formControlName="flow_rate" />
          <mat-error *ngIf="formGroup.controls['flow_rate'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Turbulent diffusive coefficient'] }}</mat-label>
          <input
            matInput
            type="number"
            formControlName="turbulent_diffusive_coefficient"
          />
          <mat-error
            *ngIf="
              formGroup.controls['turbulent_diffusive_coefficient']
                .errors as errors
            "
          >
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
      </div>
      <div mat-dialog-actions class="justify-content-end g-2">
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
export class LocationFormComponent implements OnInit {
  public readonly I18N = I18N;
  public readonly formGroup;
  public isFormSubmitted;

  public TITLE!: string;
  public SUBMIT_BUTTON_COLOR!: 'primary' | 'accent';
  private HANDLE_ENTITY!: () => Observable<any>;
  public RIVERS$!: Observable<RiverCRUDModel['getPaginatedEntitiesResult'][]>;
  public SUBSTANCES$!: Observable<
    SubstanceCRUDModel['getPaginatedEntitiesResult'][]
  >;

  constructor(
    private dialogRef: MatDialogRef<LocationFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: LocationFormData,
    private notificationService: NotificationService,
    private apiClient: ApiClient
  ) {
    const fb = new FormBuilder();
    this.formGroup = fb.group(
      {
        flow_rate: fb.control(0),
        latitude: fb.control({ value: null, disabled: true }),
        longitude: fb.control({ value: null, disabled: true }),
        name: fb.control(''),
        river_id: fb.control(null),
        chemical_elements: fb.control(''),
        turbulent_diffusive_coefficient: fb.control(0),
      },
      {
        validators: (formGroup: FormGroup) => {
          const {
            flow_rate,
            name,
            river_id,
            chemical_elements,
            turbulent_diffusive_coefficient,
          } = formGroup.controls;
          // Flow Rate
          if (flow_rate.value == null || Number.isNaN(+flow_rate.value)) {
            flow_rate.setErrors({
              message: I18N['Min must be a number.'],
            });
          } else if (flow_rate.value < 0) {
            flow_rate.setErrors({
              message: I18N['Min must be greater or equal to 0.'],
            });
          } else {
            flow_rate.setErrors(null);
          }
          // Name
          if (name.value === '') {
            name.setErrors({ message: I18N['Name is required.'] });
          } else {
            name.setErrors(null);
          }
          // River Id
          if (river_id.value == null) {
            river_id.setErrors({ message: I18N['River is required.'] });
          } else {
            river_id.setErrors(null);
          }
          // Substances
          if (!(chemical_elements.value && chemical_elements.value.length)) {
            chemical_elements.setErrors({
              message: I18N['Choose at least one substance.'],
            });
          } else {
            chemical_elements.setErrors(null);
          }
          // Turbulent Diffusive Coefficient Decay
          if (
            turbulent_diffusive_coefficient.value == null ||
            Number.isNaN(+turbulent_diffusive_coefficient.value)
          ) {
            turbulent_diffusive_coefficient.setErrors({
              message: I18N['Must be a number.'],
            });
          } else if (turbulent_diffusive_coefficient.value < 0) {
            turbulent_diffusive_coefficient.setErrors({
              message: I18N['Must be greater or equal to 0.'],
            });
          } else {
            turbulent_diffusive_coefficient.setErrors(null);
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
      this.formGroup.patchValue({
        ...this.data.entity,
        chemical_elements: this.data.entity.chemical_elements.map(
          (item) => item.id
        ),
      });
      this.TITLE = I18N['Edit $name location'](this.data.entity.name);
      this.SUBMIT_BUTTON_COLOR = 'accent';
      this.HANDLE_ENTITY = this.patchEntity;
      this.formGroup.controls['chemical_elements'].disable();
    } else {
      this.formGroup.patchValue(this.data.coordinates);
      if (this.data.riverId) {
        this.formGroup.controls['river_id'].patchValue(this.data.riverId);
      }
      this.TITLE = I18N['New Location'];
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

  private postEntity() {
    const value = {
      ...this.formGroup.getRawValue(),
      is_active: true,
    };
    return this.apiClient.location.postEntity(value).pipe(
      tap(() => {
        this.notificationService.notify(
          I18N['$name location is successfully created.'](value.name)
        );
      })
    );
  }

  private patchEntity() {
    const value = {
      ...this.formGroup.getRawValue(),
      is_active: true,
    };
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
