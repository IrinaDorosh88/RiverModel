import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { HttpClientQueryParams } from '@/features/http-client-extensions';

import { CRUDApiClientModel, CRUDApiClient } from './crud-api-client';

export interface MeasurementCRUDModel extends CRUDApiClientModel {
  getPaginatedEntitiesResult: {
    location_id: number;
    date: Date;
    values: { substance_name: string; value: number }[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class MeasurementApiClient extends CRUDApiClient<MeasurementCRUDModel> {
  constructor() {
    super('measurements');
  }

  public override getPaginatedEntities(params?: HttpClientQueryParams) {
    let result = {
      data: [
        {
          date: new Date(),
          location_id: 1,
          values: [
            { substance_name: 'S1', value: 12 },
            { substance_name: 'S2', value: 16 },
            { substance_name: 'S4', value: 13.3 },
          ],
        },
        {
          date: new Date(),
          location_id: 1,
          values: [
            { substance_name: 'S1', value: 22 },
            { substance_name: 'S2', value: 13 },
            { substance_name: 'S4', value: 11.8 },
          ],
        },
        {
          date: new Date(),
          location_id: 2,
          values: [
            { substance_name: 'S1', value: 11.5 },
            { substance_name: 'S3', value: 15.9 },
          ],
        },
      ],
      count: 3,
    };
    if (params?.['location_id']) {
      const data = result.data.filter(
        (item) => item.location_id === params['location_id']
      );
      result = {
        data,
        count: data.length,
      };
    }
    return of(result);
  }

  public override postEntity(value: any) {
    return of(true).pipe(delay(2000));
  }

  public override patchEntity() {
    return this.methodNotImplemented();
  }

  public override deleteEntity() {
    return this.methodNotImplemented();
  }
}
