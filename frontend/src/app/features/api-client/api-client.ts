import { Injectable } from '@angular/core';
import { AuthorizationApiClient } from './authorization-api-client';
import { LocationApiClient } from './location-api-client';
import { MeasurementApiClient } from './measurement-api-client';
import { PredictionApiClient } from './prediction-api-client';
import { RiverApiClient } from './river-api-client';
import { SubstanceApiClient } from './substance-api-client';

@Injectable({
  providedIn: 'root',
})
export class ApiClient {
  constructor(
    public authorization: AuthorizationApiClient,
    public location: LocationApiClient,
    public measurement: MeasurementApiClient,
    public prediction: PredictionApiClient,
    public river: RiverApiClient,
    public substance: SubstanceApiClient
  ) {}
}
