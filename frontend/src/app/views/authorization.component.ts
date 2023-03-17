import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
];

import { AuthorizationService } from '@app/features/authorization';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  selector: 'app-login',
  template: `
    <form class="background-color-white" [formGroup]="formGroup">
      <h2 mat-dialog-title>{{ register ? 'SIGN UP' : 'SIGN IN' }}</h2>

      <div mat-dialog-content>
        <mat-form-field class="width-full" appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" />
          <mat-error *ngIf="formGroup.controls['email'].invalid">{{
            formGroup.controls['email'].errors!['email'] ?? 'Email is required.'
          }}</mat-error>
        </mat-form-field>

        <mat-form-field class="width-full" appearance="fill">
          <mat-label>Password</mat-label>
          <input
            matInput
            formControlName="password"
            [type]="passwordHidden ? 'password' : 'text'"
          />
          <mat-icon matSuffix (click)="passwordHidden = !passwordHidden">{{
            passwordHidden ? 'visibility_off' : 'visibility'
          }}</mat-icon>
          <mat-error *ngIf="formGroup.controls['password'].invalid"
            >Password is required.</mat-error
          >
        </mat-form-field>

        <mat-form-field *ngIf="register" class="width-full" appearance="fill">
          <mat-label>Confirm</mat-label>
          <input
            matInput
            formControlName="confirm"
            [type]="confirmHidden ? 'password' : 'text'"
          />
          <mat-icon matSuffix (click)="confirmHidden = !confirmHidden">{{
            confirmHidden ? 'visibility_off' : 'visibility'
          }}</mat-icon>
          <mat-error *ngIf="formGroup.controls['confirm'].invalid">
            {{
              formGroup.controls['confirm'].errors!['required']
                ? 'Passwords confirm is required.'
                : 'Passwords do not match.'
            }}
          </mat-error>
        </mat-form-field>
      </div>

      <div mat-dialog-actions>
        <a
          class="mr-auto ml-3 cursor-pointer hover:text-decoration-underline"
          (click)="onAuthorizationTypeToggle()"
        >
          {{ register ? 'Sign in?' : 'Sign up?' }}
        </a>
        <button
          mat-flat-button
          color="primary"
          type="submit"
          [disabled]="formGroup.invalid"
          (click)="onSubmitClick(formGroup.value)"
        >
          Submit
        </button>
        <button mat-flat-button mat-dialog-close>Close</button>
      </div>
    </form>
  `,
})
export class AuthorizationComponent implements OnInit {
  public passwordHidden: boolean = true;
  public confirmHidden: boolean = true;

  public register!: boolean;
  public formGroup!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { register: boolean } | undefined,
    private dialogRef: MatDialogRef<AuthorizationComponent>,
    private service: AuthorizationService
  ) {}

  public ngOnInit() {
    this.register = this.data?.register ?? false;

    const fb = new FormBuilder();
    this.formGroup = fb.group(
      {
        email: fb.control('', Validators.required),
        password: fb.control('', Validators.required),
        confirm: fb.control(
          { value: '', disabled: !this.register },
          Validators.required
        ),
      },
      {
        validators: (formGroup: FormGroup) => {
          if (formGroup.controls['confirm'].enabled) {
            if (formGroup.controls['confirm'].value === '')
              formGroup.controls['confirm'].setErrors({ required: true });
            else
              formGroup.controls['confirm'].setErrors(
                formGroup.controls['confirm'].value !==
                  formGroup.controls['password'].value
                  ? { notMatch: true }
                  : null
              );
          }
        },
      }
    );
  }

  public onAuthorizationTypeToggle() {
    this.register = !this.register;
    this.formGroup.controls['confirm'].reset('');
    this.formGroup.controls['confirm'][this.register ? 'enable' : 'disable']();
  }

  public onSubmitClick(model: { email: string; password: string }) {
    if (this.register) {
      this.service.register(model).subscribe({
        next: (next) => {
          console.log(next);
          this.onAuthorizationTypeToggle();
        },
        error: (error) => {
          Object.entries(error.error).forEach(([key, value]) => {
            this.formGroup.controls[key].setErrors({ [key]: value });
          });
        },
      });
    } else {
      this.service.login(model).subscribe({
        next: (next) => {
          console.log(next);
          this.dialogRef.close();
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
}
