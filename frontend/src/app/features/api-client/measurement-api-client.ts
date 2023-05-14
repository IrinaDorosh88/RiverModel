import { Injectable } from '@angular/core';

import { CRUDApiClientModel, CRUDApiClient } from './crud-api-client';

type GetEntityResult = {
  date: Date;
  measurements: {
    location_id: number;
    concentration_value: number;
    chemical_element: {
      id: number;
      name: string;
      units: string;
    };
    prediction_points: {
      value: number;
      time: number;
    }[];
  }[];
};

export interface MeasurementCRUDModel extends CRUDApiClientModel {
  getPaginatedEntitiesResult: GetEntityResult;
  getEntitiesResult: GetEntityResult;
  getEntityResult: GetEntityResult;
}

@Injectable({
  providedIn: 'root',
})
export class MeasurementApiClient extends CRUDApiClient<MeasurementCRUDModel> {
  constructor() {
    super('measurements');
  }

  public override patchEntity() {
    return this.methodNotImplemented();
  }

  public override deleteEntity() {
    return this.methodNotImplemented();
  }
}
