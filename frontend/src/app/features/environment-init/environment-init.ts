import { APP_INITIALIZER, Provider } from '@angular/core';

export let ENVIRONMENT: {
  API_HOST: string;
};

export const ENVIRONMENT_INITIALIZER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useValue: async () => {
    ENVIRONMENT = await fetch('assets/app-config.json').then((config) =>
      config.json()
    );
  },
};
