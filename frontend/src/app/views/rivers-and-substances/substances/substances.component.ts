import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, tap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
const MATERIAL_MODULES = [MatButtonModule, MatIconModule, MatTableModule];

import { SubstanceCRUDModel, SubstanceService } from '@app/features/api-client';
import { ConfirmationDialogService } from '@app/features/confirmation-dialog';
import { NotificationService } from '@app/features/notification';

import { TOOLBAR_ACTION$$ } from '@app/views/home';

import {
  SubstanceFormComponent,
  SubstanceFormData,
} from './substance-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-substances',
  template: `
    <table mat-table class="p-3" [dataSource]="DATA_SOURCE">
      <ng-container matColumnDef="name">
        <th *matHeaderCellDef mat-header-cell>Name</th>
        <td *matCellDef="let item" mat-cell>{{ item.name }}</td>
      </ng-container>

      <ng-container matColumnDef="min">
        <th *matHeaderCellDef mat-header-cell>Min</th>
        <td *matCellDef="let item" mat-cell>{{ item.min }}</td>
      </ng-container>

      <ng-container matColumnDef="max">
        <th *matHeaderCellDef mat-header-cell>Max</th>
        <td *matCellDef="let item" mat-cell>{{ item.max }}</td>
      </ng-container>

      <ng-container matColumnDef="unit">
        <th *matHeaderCellDef mat-header-cell>Unit</th>
        <td *matCellDef="let item" mat-cell>{{ item.unit }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th *matHeaderCellDef mat-header-cell>Actions</th>
        <td *matCellDef="let item" mat-cell>
          <div class="display-flex gap-2">
            <button mat-mini-fab color="accent" (click)="onEditClicked(item)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-mini-fab color="warn" (click)="onDeleteClicked(item)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="DISPLAYED_COLUMNS"></tr>
      <tr mat-row *matRowDef="let row; columns: DISPLAYED_COLUMNS"></tr>
    </table>
  `,
})
export class SubstancesComponent implements OnInit, OnDestroy {
  public readonly DISPLAYED_COLUMNS;
  public readonly DATA_SOURCE;
  private readonly SUBSCRIPTIONS;

  constructor(
    private matDialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private service: SubstanceService
  ) {
    this.DISPLAYED_COLUMNS = ['name', 'min', 'max', 'unit', 'actions'];
    this.DATA_SOURCE = new MatTableDataSource<
      SubstanceCRUDModel['getEntitiesResult']
    >([]);
    this.SUBSCRIPTIONS = new Subscription();
  }

  public ngOnInit() {
    this.refreshEntities();

    this.SUBSCRIPTIONS.add(
      TOOLBAR_ACTION$$.subscribe({
        next: ({ key }) => {
          switch (key) {
            case 'SUBSTANCES_NEW_SUBSTANCE':
              this.onCreateClicked();
              break;
          }
        },
      })
    );
  }

  public ngOnDestroy(): void {
    this.SUBSCRIPTIONS.unsubscribe();
  }

  private onCreateClicked() {
    this.openDialog();
  }

  public onEditClicked(item: SubstanceCRUDModel['getEntitiesResult']) {
    this.openDialog(item);
  }

  public onDeleteClicked(item: any) {
    this.confirmationDialogService.open({
      title: `Delete ${item.name}`,
      confirmCallback: () => {
        return this.service.deleteEntity(item.id).pipe(
          tap(() => {
            this.notificationService.notify(
              `${item.name} is successfully deleted!`
            );
          })
        );
      },
    });
  }

  private openDialog(data?: any) {
    this.matDialog
      .open<SubstanceFormComponent, SubstanceFormData, boolean>(
        SubstanceFormComponent,
        {
          width: '400px',
          data,
        }
      )
      .afterClosed()
      .subscribe({
        next: (next) => {
          if (next) {
            this.refreshEntities();
          }
        },
      });
  }

  private refreshEntities() {
    this.service.getEntities().subscribe({
      next: (data) => {
        this.DATA_SOURCE.data = data;
      },
    });
  }
}
