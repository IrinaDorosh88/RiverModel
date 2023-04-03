import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { AbstractApiClient } from './abstract-api-client';

export type AuthorizationModel = {
  email: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthorizationApiClient extends AbstractApiClient {
  public register(model: AuthorizationModel): Observable<{ status: string }> {
    const result =
      model.email === 'admin'
        ? of({ status: 'REGISTER: ok' })
        : new Observable<{ status: string }>((subscriber) => {
            subscriber.error({
              error: { email: 'This email is already taken.' },
            });
          });
    return result.pipe(delay(2000));
  }

  public login(
    model: AuthorizationModel
  ): Observable<{ email: string; role: string }> {
    const result =
      model.email === 'admin' && model.password === 'admin'
        ? of({ email: 'admin@gmail.com', role: 'ADMIN' })
        : new Observable<{ email: string; role: string }>((subscriber) => {
            subscriber.error({
              error: { message: 'Invalid user credentials' },
            });
          });
    return result.pipe(delay(2000));
  }

  public logout() {
    return of({ status: 'LOGOUT: ok' });
  }
}
