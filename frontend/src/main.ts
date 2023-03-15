import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent, APP_CONFIG } from './app/app.component';

bootstrapApplication(AppComponent, APP_CONFIG).catch((err) =>
  console.error(err)
);
