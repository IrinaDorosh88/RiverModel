import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';

import { HttpClientQueryParams } from '@/features/http-client-extensions';

import { CRUDApiClient, CRUDApiClientModel } from './crud-api-client';
import { RiverApiClient } from './river-api-client';

export interface LocationCRUDModel extends CRUDApiClientModel {
  getEntitiesResult: {
    flow_rate: number;
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    river_id: number;
    river_name: string;
    chemical_elements: {
      id: number;
      max_value: number;
      min_value: number;
      units: string;
      name: string;
    }[];
    turbulent_diffusive_coefficient: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class LocationApiClient extends CRUDApiClient<LocationCRUDModel> {
  constructor(private riverApiClient: RiverApiClient) {
    super('locations');
  }

  public override getEntities(params: HttpClientQueryParams) {
    return combineLatest([
      super.getEntities(params) as Observable<any>,
      this.riverApiClient.getEntities().pipe(
        map((next) =>
          next.reduce((accumulator, item) => {
            accumulator[item.id] = item.name;
            return accumulator;
          }, {} as { [key: string]: string })
        )
      ),
    ]).pipe(
      map(([next, rivers]) => {
        next.forEach((item: any) => {
          item.river_name = rivers[item.river_id];
        });
        return next as LocationCRUDModel['getEntitiesResult'][];
      })
    );
  }
}
