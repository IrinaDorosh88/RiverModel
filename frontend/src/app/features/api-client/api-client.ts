import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { ENVIRONMENT } from '@app/features/environment-init';

export abstract class ApiClient {
  protected httpClient: HttpClient;
  protected apiHost: string;

  constructor() {
    this.httpClient = inject(HttpClient);
    this.apiHost = ENVIRONMENT.API_HOST;
  }
}
