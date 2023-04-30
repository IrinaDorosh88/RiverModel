import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { AbstractApiClient } from './abstract-api-client';

export type AuthorizationModel = {
  login: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthorizationApiClient extends AbstractApiClient {
  public register(model: AuthorizationModel) {
    return this.httpClient.post<unknown>(`${this.apiHost}/users/`, model);
  }

  public login(model: AuthorizationModel) {
    return this.httpClient.post<{ access_token: string }>(`${this.apiHost}/auth/`, model);
  }

  public logout() {
    return of({ status: 'LOGOUT: ok' });
  }
}
