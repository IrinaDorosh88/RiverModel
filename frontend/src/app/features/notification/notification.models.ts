import { Provider } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NotificationService } from './notification.service';

export const NOTIFICATION_PROVIDERS: Provider[] = [
  MatSnackBar,
  NotificationService,
];
