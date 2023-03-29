import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, tap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
const MATERIAL_MODULES = [MatButtonModule, MatIconModule, MatTableModule];

import { RiverService, RiverCRUDModel } from '@app/features/api-client';
import { ConfirmationDialogService } from '@app/features/confirmation-dialog';
import { NotificationService } from '@app/features/notification';

import { TOOLBAR_ACTION$$ } from '@app/views/toolbar';
import { RiverFormComponent } from './river-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-rivers',
  template: `
    <table mat-table class="p-3" [dataSource]="DATA_SOURCE">
      <ng-container matColumnDef="index">
        <th *matHeaderCellDef mat-header-cell>No.</th>
        <td *matCellDef="let index = index" mat-cell>{{ index + 1 }}</td>
      </ng-container>

      <ng-container matColumnDef="name">
        <th *matHeaderCellDef mat-header-cell>Name</th>
        <td *matCellDef="let item" mat-cell>{{ item.name }}</td>
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
export class RiversComponent implements OnInit, OnDestroy {
  public readonly DISPLAYED_COLUMNS;
  public readonly DATA_SOURCE;
  private readonly SUBSCRIPTIONS;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly notificationService: NotificationService,
    private readonly service: RiverService
  ) {
    this.DISPLAYED_COLUMNS = ['index', 'name', 'actions'];
    this.DATA_SOURCE = new MatTableDataSource<
      RiverCRUDModel['getEntitiesResult']
    >([]);
    this.SUBSCRIPTIONS = new Subscription();
  }

  public ngOnInit() {
    this.refreshEntities();

    this.SUBSCRIPTIONS.add(
      TOOLBAR_ACTION$$.subscribe({
        next: ({ key }) => {
          switch (key) {
            case 'NEW_RIVER':
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

  public onEditClicked(item: RiverCRUDModel['getEntitiesResult']) {
    this.openDialog(item);
  }

  public onDeleteClicked(item: RiverCRUDModel['getEntitiesResult']) {
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
      .open<RiverFormComponent, RiverCRUDModel['getEntitiesResult'], boolean>(
        RiverFormComponent,
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
