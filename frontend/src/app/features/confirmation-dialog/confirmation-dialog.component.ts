import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
const MATERIAL_MODULES = [MatButtonModule, MatDialogModule];

import { ConfirmationDialogData } from './confirmation-dialog.models';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  selector: 'app-confirmation-dialog',
  template: `
    <form spellcheck="false" (submit)="$event.preventDefault()">
      <div mat-dialog-title>{{ data.title }}</div>
      <div mat-dialog-content>Are you sure?</div>
      <div mat-dialog-actions class="justify-content-end gap-2">
        <button
          mat-flat-button
          color="warn"
          type="submit"
          [disabled]="isConfirmButtonDisabled"
          (click)="onConfirmClick()"
        >
          Confirm
        </button>
        <button mat-flat-button mat-dialog-close>Close</button>
      </div>
    </form>
  `,
})
export class ConfirmationDialogComponent {
  public isConfirmButtonDisabled: boolean;
  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
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
      },
    });
  }
}
