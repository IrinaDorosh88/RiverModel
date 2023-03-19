import { APP_INITIALIZER, Provider } from '@angular/core';

import { User } from './user.model';

export const USER_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useValue: () => {
    const userStr = localStorage.getItem('token');
    if (userStr) {
      User.fromObject(JSON.parse(userStr));
    }
  },
};
