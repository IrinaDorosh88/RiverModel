import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { HttpClientQueryParams } from '@/features/http-client-extensions';
import { PaginatedData } from '@/features/paginated-data';

import { CRUDApiClient, CRUDApiClientModel } from './crud-api-client';

export interface SubstanceCRUDModel extends CRUDApiClientModel {
  getPaginatedEntitiesResult: PaginatedData<{
    id: number;
    name: string;
    min: number;
    max: number;
    unit: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class SubstanceApiClient extends CRUDApiClient<SubstanceCRUDModel> {
  constructor() {
    super('sustances');
  }

  public override getPaginatedEntities(params?: HttpClientQueryParams) {
    return of({
      data: [
        { id: 1, name: 'Hydrogen', min: 1.0079, max: 2.0079, unit: 'g/mol' },
        { id: 2, name: 'Helium', min: 4.0026, max: 5.0026, unit: 'g/mol' },
        { id: 3, name: 'Lithium', min: 6.941, max: 7.941, unit: 'g/mol' },
        { id: 4, name: 'Beryllium', min: 9.0122, max: 10.0122, unit: 'g/mol' },
        { id: 5, name: 'Boron', min: 10.811, max: 11.811, unit: 'g/mol' },
        { id: 6, name: 'Carbon', min: 12.0107, max: 13.0107, unit: 'g/mol' },
        { id: 7, name: 'Nitrogen', min: 14.0067, max: 15.0067, unit: 'g/mol' },
        { id: 8, name: 'Oxygen', min: 15.9994, max: 16.9994, unit: 'g/mol' },
        { id: 9, name: 'Fluorine', min: 18.9984, max: 17.9984, unit: 'g/mol' },
        { id: 10, name: 'Neon', min: 20.1797, max: 21.1797, unit: 'g/mol' },
      ],
      count: 10,
    });
  }

  public override postEntity(value: any): Observable<unknown> {
    return of(true).pipe(delay(2000));
  }

  public override patchEntity(id: number, value: any): Observable<unknown> {
    return of(true).pipe(delay(2000));
  }

  public override deleteEntity(id: number): Observable<unknown> {
    return of(true).pipe(delay(2000));
  }
}
