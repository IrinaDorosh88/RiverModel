import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
const MATERIAL_MODULES = [MatButtonModule, MatIconModule, MatTableModule];

import { SubstancesService } from '@app/features/api-client';

import { TOOLBAR_ACTION$$ } from '@app/views/toolbar';

@Component({
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  selector: 'app-substances',
  template: `
    <table mat-table class="p-3" [dataSource]="dataSource">
      <ng-container matColumnDef="index">
        <th *matHeaderCellDef mat-header-cell>No.</th>
        <td *matCellDef="let index = index" mat-cell>{{ index + 1 }}</td>
      </ng-container>

      <ng-container matColumnDef="name">
        <th *matHeaderCellDef mat-header-cell>Name</th>
        <td *matCellDef="let item" mat-cell>{{ item.name }}</td>
      </ng-container>

      <ng-container matColumnDef="weight">
        <th *matHeaderCellDef mat-header-cell>Weight</th>
        <td *matCellDef="let item" mat-cell>{{ item.weight }}</td>
      </ng-container>

      <ng-container matColumnDef="symbol">
        <th *matHeaderCellDef mat-header-cell>Symbol</th>
        <td *matCellDef="let item" mat-cell>{{ item.symbol }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th *matHeaderCellDef mat-header-cell>Actions</th>
        <td *matCellDef="let item" mat-cell>
          <div class="display-flex gap-2">
            <button mat-mini-fab color="accent" (click)="onEditClick(item)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-mini-fab color="warn" (click)="onDeleteClick(item)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
})
export class SubstancesComponent implements OnInit, OnDestroy {
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<any>;

  private readonly TOOLBAR_ACTION_MAPPER: {
    [key: string]: (...params: any) => void;
  } = {
    NEW_SUBSTANCE: this.onCreateClick.bind(this),
  };

  constructor(private service: SubstancesService) {
    this.displayedColumns = ['index', 'name', 'weight', 'symbol', 'actions'];
    this.dataSource = new MatTableDataSource([] as any);
  }

  public ngOnInit() {
    this.refreshEntities();

    this.subscription = TOOLBAR_ACTION$$.subscribe({
      next: ({ key, params }) => this.TOOLBAR_ACTION_MAPPER[key]?.(...params),
    });
  }

  private subscription!: Subscription;
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private onCreateClick() {
    console.log({ CREATE: 'Hello from SUBSTANCES!' });
  }

  public onEditClick(item: any) {
    console.log({ EDIT: item });
  }

  public onDeleteClick(item: any) {
    console.log({ DELETE: item });
  }

  private refreshEntities() {
    this.service.getEntities().subscribe({
      next: data => {
        this.dataSource.data = data;
      }
    })
  }
}
