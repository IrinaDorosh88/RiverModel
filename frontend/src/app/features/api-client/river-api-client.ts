import { Injectable } from '@angular/core';

import { CRUDApiClient, CRUDApiClientModel } from './crud-api-client';

type GetEntitiesResult = { id: number; name: string };

export interface RiverCRUDModel extends CRUDApiClientModel {
  getEntitiesResult: GetEntitiesResult;
  getPaginatedEntitiesResult: GetEntitiesResult;
}

@Injectable({
  providedIn: 'root',
})
export class RiverApiClient extends CRUDApiClient<RiverCRUDModel> {
  constructor() {
    super('rivers');
  }
}
