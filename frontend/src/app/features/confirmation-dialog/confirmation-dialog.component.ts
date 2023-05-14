import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
const MATERIAL_MODULES = [MatButtonModule, MatDialogModule];

import { I18N } from '@/features/i18n';
import { NotificationService } from '@/features/notification';

import { ConfirmationDialogData } from './confirmation-dialog.models';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-confirmation-dialog',
  template: `
    <form spellcheck="false" (submit)="$event.preventDefault()">
      <div mat-dialog-title>{{ data.title }}</div>
      <div mat-dialog-content>{{ I18N['Are you sure?'] }}</div>
      <div mat-dialog-actions class="justify-content-end g-2">
        <button
          mat-flat-button
          color="warn"
          type="submit"
          [disabled]="isConfirmButtonDisabled"
          (click)="onConfirmClick()"
        >
          {{ I18N['Yes'] }}
        </button>
        <button mat-flat-button mat-dialog-close>{{ I18N['No'] }}</button>
      </div>
    </form>
  `,
})
export class ConfirmationDialogComponent {
  public readonly I18N = I18N;
  public isConfirmButtonDisabled: boolean;

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {
    this.isConfirmButtonDisabled = false;
  }

  public onConfirmClick() {
    this.isConfirmButtonDisabled = true;
    this.data.confirmCallback().subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: () => {
        this.isConfirmButtonDisabled = false;
        this.notificationService.notify(I18N['Something went wrong.']);
      },
    });
  }
}
