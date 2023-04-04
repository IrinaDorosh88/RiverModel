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
    return model.email === 'admin'
      ? of({ status: 'REGISTER: ok' }).pipe(delay(2000))
      : new Observable<{ status: string }>((subscriber) => {
          setTimeout(() => {
            subscriber.error({
              error: { email: 'This email is already taken.' },
            });
          }, 2000);
        });
  }

  public login(
    model: AuthorizationModel
  ): Observable<{ email: string; role: string }> {
    return model.email === 'admin' && model.password === 'admin'
      ? of({ email: 'admin@gmail.com', role: 'ADMIN' }).pipe(delay(2000))
      : new Observable<{ email: string; role: string }>((subscriber) => {
          setTimeout(() => {
            subscriber.error({
              error: { message: 'Invalid user credentials' },
            });
          }, 2000);
        });
  }

  public logout() {
    return of({ status: 'LOGOUT: ok' });
  }
}
