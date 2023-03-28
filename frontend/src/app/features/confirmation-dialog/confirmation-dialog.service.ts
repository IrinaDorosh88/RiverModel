import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

import { ConfirmationDialogData } from './confirmation-dialog.models';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  constructor(private matDialog: MatDialog) {}

  public open(data: ConfirmationDialogData) {
    this.matDialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data,
    });
  }
}
