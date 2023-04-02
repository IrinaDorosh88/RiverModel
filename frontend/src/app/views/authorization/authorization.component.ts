import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
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

import { AuthorizationService } from '@app/features/api-client';
import { NotificationService } from '@app/features/notification';
import { User } from '@app/features/user';

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
      <h2 mat-dialog-title>{{ register ? 'SIGN UP' : 'SIGN IN' }}</h2>

      <div mat-dialog-content>
        <mat-form-field class="width-full">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" />
          <mat-error *ngIf="FORM_GROUP.controls['email'].errors as errors">
            {{ errors['message'] }}
          </mat-error>
        </mat-form-field>

        <mat-form-field class="width-full">
          <mat-label>Password</mat-label>
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
          <mat-label>Confirm</mat-label>
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
          {{ register ? 'Sign in?' : 'Sign up?' }}
        </a>
        <button
          mat-flat-button
          color="primary"
          type="submit"
          [disabled]="FORM_GROUP.invalid || isFormSubmitted"
          (click)="onSubmitClick(FORM_GROUP.value)"
        >
          Submit
        </button>
        <button mat-flat-button mat-dialog-close>Close</button>
      </div>
    </form>
  `,
})
export class AuthorizationComponent implements OnInit {
  public readonly FORM_GROUP;
  public isFormSubmitted;
  public passwordHidden;
  public confirmHidden;

  public register!: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { register: boolean } | undefined,
    private dialogRef: MatDialogRef<AuthorizationComponent>,
    private notificationService: NotificationService,
    private service: AuthorizationService
  ) {
    const fb = new FormBuilder();
    this.FORM_GROUP = fb.group(
      {
        email: fb.control(''),
        password: fb.control(''),
        confirm: fb.control(''),
      },
      {
        validators: (formGroup: FormGroup) => {
          const { email, password, confirm } = formGroup.controls;
          // Email
          if (email.value === '') {
            email.setErrors({ message: 'Name is required.' });
          } else {
            email.setErrors(null);
          }
          // Password
          if (password.value === '') {
            password.setErrors({ message: 'Password is required.' });
          } else {
            password.setErrors(null);
          }
          // Confirm
          if (confirm.value === '') {
            confirm.setErrors({ message: 'Confirm is required.' });
          } else if (confirm.value !== password.value) {
            confirm.setErrors({ message: 'Passwords do not match' });
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
    this.FORM_GROUP.controls['confirm'].patchValue('');
    this.FORM_GROUP.controls['confirm'][this.register ? 'enable' : 'disable']();
    this.FORM_GROUP.controls['confirm'].markAsUntouched();
  }

  public onSubmitClick(model: { email: string; password: string }) {
    this.isFormSubmitted = true;
    if (this.register) {
      this.service.register(model).subscribe({
        next: () => {
          this.notificationService.notify('You are successfully signed up!');
          this.onAuthorizationTypeToggle();
        },
        error: (error) => {
          Object.entries(error.error).forEach(([key, value]) => {
            this.FORM_GROUP.controls[key].setErrors({ message: value });
          });
        },
        complete: () => {
          this.isFormSubmitted = false;
        },
      });
    } else {
      this.service.login(model).subscribe({
        next: (next) => {
          this.notificationService.notify('You are successfully signed in!');
          User.fromObject(next);
          localStorage.setItem('token', JSON.stringify(next));
          this.dialogRef.close();
        },
        error: () => {
          this.notificationService.notify('Invalid credentials!');
          this.isFormSubmitted = false;
        },
      });
    }
  }
}
