import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { HttpClientQueryParams } from '@app/features/http-client-extensions';
import { CRUDApiClient, CRUDApiClientModel } from './crud-api-client';

export interface RiverCRUDModel extends CRUDApiClientModel {
  getEntitiesResult: { id: number; name: string };
}

@Injectable({
  providedIn: 'root',
})
export class RiverApiClient extends CRUDApiClient<RiverCRUDModel> {
  constructor() {
    super('rivers');
  }

  public override getEntities(params?: HttpClientQueryParams) {
    return of([
      { id: 1, name: 'Zbruch' },
      { id: 2, name: 'Western' },
      { id: 3, name: 'Vysun' },
      { id: 4, name: 'Vovcha' },
      { id: 5, name: 'Vorskla' },
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
