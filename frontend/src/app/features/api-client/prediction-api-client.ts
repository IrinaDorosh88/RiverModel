import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CRUDApiClient, CRUDApiClientModel } from './crud-api-client';

function getRandomInt(max: number = 20, min: number = 0) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(max: Date = new Date(), min: Date = new Date(0)) {
  return new Date(getRandomInt(max.getTime(), min.getTime()));
}

type GetEntityResult = {
  id: number;
  location_id: number;
  substances: {
    id: number;
    name: string;
    unit: string;
    values: {
      x: number;
      y: number;
    }[];
  }[];
};

export interface PredictionCRUDModel extends CRUDApiClientModel {
  getPaginatedEntitiesResult: GetEntityResult[];
  getEntityResult: GetEntityResult;
}

@Injectable({
  providedIn: 'root',
})
export class PredictionApiClient extends CRUDApiClient<PredictionCRUDModel> {
  constructor() {
    super('predictions');
  }

  public getEntityByLocationId(
    location_id: number
  ): Observable<PredictionCRUDModel['getEntityResult']> {
    const predictions = [
      {
        id: 1,
        location_id: 1,
        substances: [
          {
            id: 1,
            name: 'Hydrogen',
            unit: 'g/mol',
            values: new Array(getRandomInt(20, 5))
              .fill(null)
              .map(() => {
                return { x: getRandomInt(20), y: getRandomInt(20) };
              })
              .sort((a, b) => a.x - b.x),
          },
          {
            id: 2,
            name: 'Helium',
            unit: 'g/mol',
            values: new Array(getRandomInt(20, 5))
              .fill(null)
              .map(() => {
                return { x: getRandomInt(20), y: getRandomInt(20) };
              })
              .sort((a, b) => a.x - b.x),
          },
          {
            id: 4,
            name: 'Beryllium',
            unit: 'g/mol',
            values: new Array(getRandomInt(20, 5))
              .fill(null)
              .map(() => {
                return { x: getRandomInt(20), y: getRandomInt(20) };
              })
              .sort((a, b) => a.x - b.x),
          },
        ],
      },
      {
        id: 2,
        location_id: 2,
        substances: [
          {
            id: 2,
            name: 'Lithium',
            unit: 'g/mol',
            values: new Array(getRandomInt(20, 5))
              .fill(null)
              .map(() => {
                return { x: getRandomInt(20), y: getRandomInt(20) };
              })
              .sort((a, b) => a.x - b.x),
          },
          {
            id: 4,
            name: 'Beryllium',
            unit: 'g/mol',
            values: new Array(getRandomInt(20, 5))
              .fill(null)
              .map(() => {
                return { x: getRandomInt(20), y: getRandomInt(20) };
              })
              .sort((a, b) => a.x - b.x),
          },
        ],
      },
    ];
    return of(
      predictions.find((entity) => entity.location_id === location_id)!
    );
  }
}
