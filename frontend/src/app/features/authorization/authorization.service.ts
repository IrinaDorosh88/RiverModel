import { Injectable } from '@angular/core';

import { ApiClient } from '@app/features/api-client';
import { User } from '@app/features/user';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService extends ApiClient {
  private user$$: BehaviorSubject<User | undefined>;
  public get user$(): Observable<User | undefined> {
    return this.user$$;
  }
  public get user() {
    return this.user$$.value;
  }

  constructor() {
    super();
    this.user$$ = new BehaviorSubject<User | undefined>(undefined);
  }

  public register(model: { email: string; password: string }) {
    if (model.email === 'admin') {
      return of({ status: 'REGISTER: ok' });
    } else {
      return new Observable((subscriber) => {
        subscriber.error({ error: { email: 'This email is already taken.' } });
      });
    }
  }

  public login(model: { email: string; password: string }) {
    if (model.email === 'admin' && model.password === 'admin') {
      const user = { email: 'admin@gmail.com', role: 'ADMIN' };
      localStorage.setItem('token', JSON.stringify(user));
      this.user$$.next(user);
      return of({ status: 'LOGIN: ok' });
    } else {
      return new Observable((subscriber) => {
        subscriber.error({ error: { message: 'Invalid user credentials' } });
      });
    }
  }

  public logout() {
    this.user$$.next(undefined);
    localStorage.removeItem('token');
    return of({ status: 'LOGOUT: ok' });
  }
}
