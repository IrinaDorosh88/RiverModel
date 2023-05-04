import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

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

import { ApiClient } from '@/features/api-client';
import { NotificationService } from '@/features/notification';
import { User } from '@/features/user';
import { I18N } from '@/features/i18n';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  selector: 'app-login',
  template: `
    <form
      spellcheck="false"
      class="background-color-white"
      [formGroup]="FORM_GROUP"
    >
      <h2 mat-dialog-title>{{ I18N[register ? 'SIGN UP' : 'SIGN IN'] }}</h2>

      <div mat-dialog-content>
        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Login'] }}</mat-label>
          <input matInput formControlName="login" />
          <mat-error *ngIf="FORM_GROUP.controls['login'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>

        <mat-form-field class="width-full">
          <mat-label>{{ I18N['Password'] }}</mat-label>
          <input
            matInput
            formControlName="password"
            [type]="passwordHidden ? 'password' : 'text'"
          />
          <mat-icon matSuffix (click)="passwordHidden = !passwordHidden">{{
            passwordHidden ? 'visibility_off' : 'visibility'
          }}</mat-icon>
          <mat-error *ngIf="FORM_GROUP.controls['password'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>

        <mat-form-field *ngIf="register" class="width-full">
          <mat-label>{{ I18N['Confirm'] }}</mat-label>
          <input
            matInput
            formControlName="confirm"
            [type]="confirmHidden ? 'password' : 'text'"
          />
          <mat-icon matSuffix (click)="confirmHidden = !confirmHidden">{{
            confirmHidden ? 'visibility_off' : 'visibility'
          }}</mat-icon>
          <mat-error *ngIf="FORM_GROUP.controls['confirm'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>
      </div>

      <div mat-dialog-actions>
        <a
          class="mr-auto ml-3 cursor-pointer hover:text-decoration-underline"
          (click)="onAuthorizationTypeToggle()"
        >
          {{ I18N[register ? 'Sign in?' : 'Sign up?'] }}
        </a>
        <button
          mat-flat-button
          color="primary"
          type="submit"
          [disabled]="FORM_GROUP.invalid || isFormSubmitted"
          (click)="onSubmitClick(FORM_GROUP.value)"
        >
          {{ I18N['Submit'] }}
        </button>
        <button mat-flat-button mat-dialog-close>{{ I18N['Close'] }}</button>
      </div>
    </form>
  `,
})
export class AuthorizationComponent implements OnInit {
  public readonly I18N = I18N;
  public readonly FORM_GROUP;
  public isFormSubmitted;
  public passwordHidden;
  public confirmHidden;

  public register!: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { register: boolean } | undefined,
    private dialogRef: MatDialogRef<AuthorizationComponent>,
    private notificationService: NotificationService,
    private apiClient: ApiClient
  ) {
    const fb = new FormBuilder();
    this.FORM_GROUP = fb.group(
      {
        login: fb.control(''),
        password: fb.control(''),
        confirm: fb.control(''),
      },
      {
        validators: (formGroup: FormGroup) => {
          const { login, password, confirm } = formGroup.controls;
          // Email
          if (login.value === '') {
            login.setErrors({ message: I18N['Login is required.'] });
          } else {
            login.setErrors(null);
          }
          // Password
          if (password.value === '') {
            password.setErrors({ message: I18N['Password is required.'] });
          } else {
            password.setErrors(null);
          }
          // Confirm
          if (confirm.value === '') {
            confirm.setErrors({ message: I18N['Confirm is required.'] });
          } else if (confirm.value !== password.value) {
            confirm.setErrors({ message: I18N['Passwords do not match.'] });
          } else {
            confirm.setErrors(null);
          }
        },
      }
    );
    this.isFormSubmitted = false;
    this.passwordHidden = true;
    this.confirmHidden = true;
  }

  public ngOnInit() {
    this.register = this.data?.register ?? false;
    if (!this.register) {
      this.FORM_GROUP.controls['confirm'].disable();
    }
  }

  public onAuthorizationTypeToggle() {
    this.register = !this.register;
    if (this.register) {
      this.FORM_GROUP.controls['confirm'].enable();
      this.FORM_GROUP.controls['confirm'].patchValue('');
      this.FORM_GROUP.controls['confirm'].markAsUntouched();
    } else {
      this.FORM_GROUP.controls['confirm'].disable();
    }
  }

  public onSubmitClick(model: {
    login: string;
    password: string;
    confirm?: string;
  }) {
    this.isFormSubmitted = true;
    if (this.register) {
      delete model.confirm;
      this.apiClient.authorization.register(model).subscribe({
        next: () => {
          this.isFormSubmitted = false;
          this.notificationService.notify(
            I18N['You are successfully signed up.']
          );
          this.onAuthorizationTypeToggle();
        },
        error: (error: HttpErrorResponse) => {
          this.isFormSubmitted = false;
          if (error.status === HttpStatusCode.UnprocessableEntity) {
            Object.entries(error.error).forEach(([key, value]) => {
              this.FORM_GROUP.controls[key].setErrors({ message: value });
            });
          } else {
            this.notificationService.notify(I18N['Something went wrong.']);
          }
        },
      });
    } else {
      this.apiClient.authorization.login(model).subscribe({
        next: (next) => {
          this.notificationService.notify(
            I18N['You are successfully signed in']
          );
          User.fromToken(next.access_token);
          localStorage.setItem('token', JSON.stringify(next.access_token));
          this.dialogRef.close();
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.notify(
            I18N[
              error.status === HttpStatusCode.UnprocessableEntity
                ? 'Invalid credentials.'
                : 'Something went wrong.'
            ]
          );
          this.isFormSubmitted = false;
        },
      });
    }
  }
}
