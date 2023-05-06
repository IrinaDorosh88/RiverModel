import { Injectable } from '@angular/core';

import { PaginatedData } from '@/features/paginated-data';

import { CRUDApiClient, CRUDApiClientModel } from './crud-api-client';

export interface RiverCRUDModel extends CRUDApiClientModel {
  getPaginatedEntitiesResult: PaginatedData<{ id: number; name: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class RiverApiClient extends CRUDApiClient<RiverCRUDModel> {
  constructor() {
    super('rivers');
  }
}
