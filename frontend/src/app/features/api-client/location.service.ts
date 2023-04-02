import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { HttpClientQueryParams } from '@app/features/http-client-extensions';
import { CRUDApiClient, CRUDApiClientModel } from './crud-api-client';

export interface LocationCRUDModel extends CRUDApiClientModel {
  getEntitiesResult: {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    riverId: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class LocationService extends CRUDApiClient<LocationCRUDModel> {
  constructor() {
    super('locations');
  }

  public override getEntities(params?: HttpClientQueryParams) {
    return of([
      {
        id: 1,
        longitude: 25.94034,
        latitude: 48.29149,
        name: 'Chernivtsi',
        riverId: 1,
        substancesIds: [1, 2, 4],
      },
    ]);
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
