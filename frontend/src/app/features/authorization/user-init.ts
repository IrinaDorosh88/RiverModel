import { APP_INITIALIZER, inject, Provider } from '@angular/core';

import { AuthorizationService } from '@app/features/authorization';

export const USER_INITIALIZER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: () => {
    const as = inject(AuthorizationService);
    return () => {
      const userStr = localStorage.getItem('token');
      if (userStr) {
        as['user$$'].next(JSON.parse(userStr));
      }
    };
  },
};
