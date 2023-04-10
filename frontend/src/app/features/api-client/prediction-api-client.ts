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

type GetEntitiesResult = {
  id: number;
  locationId: number;
  substances: {
    id: number;
    name: string;
    values: {
      x: number;
      y: number;
    }[];
  }[];
}[];

export interface PredictionCRUDModel extends CRUDApiClientModel {
  getEntitiesResult: GetEntitiesResult;
  getEntityByLocationIdResult: GetEntitiesResult[number];
}

@Injectable({
  providedIn: 'root',
})
export class PredictionApiClient extends CRUDApiClient<PredictionCRUDModel> {
  constructor() {
    super('predictions');
  }

  public getEntityByLocationId(
    id: number
  ): Observable<PredictionCRUDModel['getEntityByLocationIdResult']> {
    const predictions = [
      {
        id: 1,
        locationId: 1,
        substances: [
          {
            id: 1,
            name: 'Hydrogen',
            values: new Array(getRandomInt(20, 5)).fill(null).map(() => {
              return { x: getRandomInt(20), y: getRandomInt(20) };
            }).sort((a,b) => a.x - b.x),
          },
          {
            id: 2,
            name: 'Helium',
            values: new Array(getRandomInt(20, 5)).fill(null).map(() => {
              return { x: getRandomInt(20), y: getRandomInt(20) };
            }).sort((a,b) => a.x - b.x),
          },
          {
            id: 4,
            name: 'Beryllium',
            values: new Array(getRandomInt(20, 5)).fill(null).map(() => {
              return { x: getRandomInt(20), y: getRandomInt(20) };
            }).sort((a,b) => a.x - b.x),
          },
        ],
      },
      {
        id: 2,
        locationId: 2,
        substances: [
          {
            id: 2,
            name: 'Lithium',
            values: new Array(getRandomInt(20, 5)).fill(null).map(() => {
              return { x: getRandomInt(20), y: getRandomInt(20) };
            }).sort((a,b) => a.x - b.x),
          },
          {
            id: 4,
            name: 'Beryllium',
            values: new Array(getRandomInt(20, 5)).fill(null).map(() => {
              return { x: getRandomInt(20), y: getRandomInt(20) };
            }).sort((a,b) => a.x - b.x),
          },
        ],
      },
    ];
    return of(predictions.find((entity) => entity.locationId === id)!);
  }
}
