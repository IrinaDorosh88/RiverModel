import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, startWith, Subscription } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
const MATERIAL_MODULES = [MatFormFieldModule, MatSelectModule];

import {
  ApiClient,
  LocationCRUDModel,
  RiverCRUDModel,
} from '@app/features/api-client';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  selector: 'app-location-filter',
  template: `
    <div class="display-flex flex-wrap gap-2">
      <mat-form-field style="width: 200px">
        <mat-label>River</mat-label>
        <mat-select (selectionChange)="onRiverSelectionChange($event.value)">
          <mat-option [value]="null">---</mat-option>
          <mat-option
            *ngFor="let entity of RIVERS$ | async"
            [value]="entity.id"
          >
            {{ entity.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field style="width: 200px">
        <mat-label>Location</mat-label>
        <mat-select [formControl]="LOCATION_FORM_CONTROL">
          <mat-option [value]="null">---</mat-option>
          <mat-option
            *ngFor="let entity of LOCATIONS$$ | async"
            [value]="entity.id"
          >
            {{ entity.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  `,
})
export class LocationFilterComponent implements OnInit, OnDestroy {
  @Output('selectionChange') public readonly RIVER_SELECTION_CHANGE_EMITTER =
    new EventEmitter<number | null>();

  private readonly SUBSCRIPTIONS;
  public readonly LOCATION_FORM_CONTROL;
  public LOCATIONS$$;

  public RIVERS$!: Observable<RiverCRUDModel['getEntitiesResult'][]>;

  constructor(private apiClient: ApiClient) {
    this.SUBSCRIPTIONS = new Subscription();
    this.LOCATION_FORM_CONTROL = new FormControl<number | null>(null);
    this.LOCATIONS$$ = new BehaviorSubject<
      LocationCRUDModel['getEntitiesResult'][]
    >([]);
  }

  public ngOnInit() {
    this.RIVERS$ = this.apiClient.river.getEntities().pipe(startWith([]));
    this.SUBSCRIPTIONS.add(
      this.LOCATION_FORM_CONTROL.valueChanges.subscribe({
        next: (next) => {
          this.RIVER_SELECTION_CHANGE_EMITTER.emit(next);
        },
      })
    );
  }

  public ngOnDestroy() {
    console.log(`Hello?`);
    this.SUBSCRIPTIONS.unsubscribe();
  }

  public onRiverSelectionChange(riverId: number | null) {
    if (riverId) {
      this.apiClient.location.getEntities({ river: riverId }).subscribe({
        next: (data) => {
          this.LOCATIONS$$.next(data);
        },
      });
    } else {
      this.LOCATIONS$$.next([]);
    }
    if (this.LOCATION_FORM_CONTROL.value != null) {
      this.LOCATION_FORM_CONTROL.patchValue(null);
    }
  }
}
