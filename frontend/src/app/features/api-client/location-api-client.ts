import { Injectable } from '@angular/core';

import { CRUDApiClient, CRUDApiClientModel } from './crud-api-client';

export interface LocationCRUDModel extends CRUDApiClientModel {
  getEntitiesResult: {
    flow_rate: number;
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    riverId: number;
    substancesIds: number[];
    turbulent_diffusive_coefficient: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class LocationApiClient extends CRUDApiClient<LocationCRUDModel> {
  constructor() {
    super('locations');
  }
}
