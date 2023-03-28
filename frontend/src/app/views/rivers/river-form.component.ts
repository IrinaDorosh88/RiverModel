import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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

import { RiversService } from '@app/features/api-client';
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
          <mat-error *ngIf="FORM_GROUP.controls['name'].invalid"
            >Name is required.</mat-error
          >
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
export class RiverFormComponent implements OnInit {
  public readonly FORM_GROUP: FormGroup;

  public TITLE!: string;
  public SUBMIT_BUTTON_COLOR!: string;
  private HANDLE_ENTITY!: () => Observable<any>;

  public isFormSubmitted: boolean;

  constructor(
    private dialogRef: MatDialogRef<RiverFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any | undefined,
    private notificationService: NotificationService,
    private service: RiversService
  ) {
    const fb = new FormBuilder();
    this.FORM_GROUP = fb.group({
      name: fb.control('', Validators.required),
    });

    this.isFormSubmitted = false;
  }

  public ngOnInit() {
    if (this.data) {
      this.FORM_GROUP.patchValue(this.data);
      this.TITLE = `Edit ${this.data.name}`;
      this.SUBMIT_BUTTON_COLOR = 'accent';
      this.HANDLE_ENTITY = this.putEntity;
    } else {
      this.TITLE = `New River`;
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
