import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ApiClient } from './api-client';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService extends ApiClient {
  public register(model: {
    email: string;
    password: string;
  }): Observable<{ status: 'REGISTER: ok' }> {
    if (model.email === 'admin') {
      return of({ status: 'REGISTER: ok' });
    } else {
      return new Observable((subscriber) => {
        subscriber.error({ error: { email: 'This email is already taken.' } });
      });
    }
  }

  public login(model: {
    email: string;
    password: string;
  }): Observable<{ email: string; role: string }> {
    if (model.email === 'admin' && model.password === 'admin') {
      return of({ email: 'admin@gmail.com', role: 'ADMIN' });
    } else {
      return new Observable((subscriber) => {
        subscriber.error({ error: { message: 'Invalid user credentials' } });
      });
    }
  }

  public logout() {
    return of({ status: 'LOGOUT: ok' });
  }
}
