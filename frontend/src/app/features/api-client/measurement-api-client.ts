import { Injectable } from '@angular/core';

import { CRUDApiClientModel, CRUDApiClient } from './crud-api-client';
import { Observable, delay, of } from 'rxjs';
import { HttpClientQueryParams } from '../http-client-extensions';

export interface MeasurementCRUDModel extends CRUDApiClientModel {
  getEntitiesResult: {
    date: Date;
    id: number;
    locationId: number;
    values: { [key: number]: number };
  };
}

@Injectable({
  providedIn: 'root',
})
export class MeasurementApiClient extends CRUDApiClient<MeasurementCRUDModel> {
  constructor() {
    super('measurements');
  }

  public override getEntities(params?: HttpClientQueryParams) {
    let result: MeasurementCRUDModel['getEntitiesResult'][] = [
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
    ];
    if (params?.['location']) {
      result = result.filter((item) => item.locationId === params['location']);
    }
    return of(result);
  }

  public override postEntity(value: any): Observable<unknown> {
    return of(true).pipe(delay(2000));
  }

  public override putEntity(id: number, value: any): Observable<unknown> {
    return of(true).pipe(delay(2000));
  }

  public override deleteEntity(id: number): Observable<unknown> {
    return of(true).pipe(delay(2000));
  }
}
