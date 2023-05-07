import { Injectable } from '@angular/core';

import { PaginatedData } from '@/features/paginated-data';

import { CRUDApiClient, CRUDApiClientModel } from './crud-api-client';

export interface SubstanceCRUDModel extends CRUDApiClientModel {
  getPaginatedEntitiesResult: PaginatedData<{
    id: number;
    max_value: number;
    min_value: number;
    name: string;
    timedelta_decay: number;
    units: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class SubstanceApiClient extends CRUDApiClient<SubstanceCRUDModel> {
  constructor() {
    super('elements');
  }
}
