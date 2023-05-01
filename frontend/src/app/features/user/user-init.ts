import { APP_INITIALIZER, Provider } from '@angular/core';

import { User } from './user.model';

export const USER_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useValue: () => {
    const token = localStorage.getItem('token');
    if (token) {
      User.fromToken(token);
    }
  },
};
