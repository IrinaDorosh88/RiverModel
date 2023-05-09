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

import { ApiClient, RiverCRUDModel } from '@/features/api-client';
import { I18N } from '@/features/i18n';
import { NotificationService } from '@/features/notification';

export type RiverFormData =
  | RiverCRUDModel['getPaginatedEntitiesResult']
  | undefined
  | null;

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-river-form',
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
export class RiverFormComponent implements OnInit {
  public readonly I18N = I18N;

  public readonly FORM_GROUP;
  public isFormSubmitted;

  public TITLE!: string;
  public SUBMIT_BUTTON_COLOR!: string;
  private HANDLE_ENTITY!: () => Observable<any>;

  constructor(
    private dialogRef: MatDialogRef<RiverFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: RiverFormData,
    private notificationService: NotificationService,
    private apiClient: ApiClient
  ) {
    const fb = new FormBuilder();
    this.FORM_GROUP = fb.group(
      {
        name: fb.control(''),
      },
      {
        validators: (formGroup: FormGroup) => {
          const { name } = formGroup.controls;
          // Name
          if (name.value === '') {
            name.setErrors({ message: I18N['Name is required.'] });
          } else {
            name.setErrors(null);
          }
        },
      }
    );
    this.isFormSubmitted = false;
  }

  public ngOnInit() {
    if (this.data) {
      this.FORM_GROUP.patchValue(this.data);
      this.TITLE = I18N['Edit $name river'](this.data.name);
      this.SUBMIT_BUTTON_COLOR = 'accent';
      this.HANDLE_ENTITY = this.patchEntity;
    } else {
      this.TITLE = I18N['New River'];
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
    return this.apiClient.river.postEntity(value).pipe(
      tap(() => {
        this.notificationService.notify(
          I18N['$name river is successfully created.'](value.name)
        );
      })
    );
  }

  private patchEntity() {
    const value = this.FORM_GROUP.value;
    return this.apiClient.river.patchEntity(this.data!.id, value).pipe(
      tap(() => {
        this.notificationService.notify(
          I18N['$name river is successfully edited.'](value.name)
        );
      })
    );
  }
}
