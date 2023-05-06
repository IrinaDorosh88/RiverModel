import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { HttpClientQueryParams } from '@/features/http-client-extensions';
import { PaginatedData } from '@/features/paginated-data';

import { CRUDApiClientModel, CRUDApiClient } from './crud-api-client';

export interface MeasurementCRUDModel extends CRUDApiClientModel {
  getPaginatedEntitiesResult: PaginatedData<{
    date: Date;
    id: number;
    locationId: number;
    values: { [key: number]: number };
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class MeasurementApiClient extends CRUDApiClient<MeasurementCRUDModel> {
  constructor() {
    super('measurements');
  }

  public override getPaginatedEntities(params?: HttpClientQueryParams) {
    let result: MeasurementCRUDModel['getPaginatedEntitiesResult'] = {
      data: [
        {
          date: new Date(),
          id: 1,
          locationId: 1,
          values: { 1: 12, 2: 16, 4: 13.3 },
        },
        {
          date: new Date(),
          id: 2,
          locationId: 1,
          values: { 1: 22, 2: 13, 4: 11.8 },
        },
        {
          date: new Date(),
          id: 3,
          locationId: 2,
          values: { 2: 11.4, 3: 15.9 },
        },
      ],
      count: 3,
    };
    if (params?.['location']) {
      const data = result.data.filter(
        (item) => item.locationId === params['location']
      );
      result = {
        data,
        count: data.length,
      };
    }
    return of(result);
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
