import { Observable } from 'rxjs';

export type ConfirmationDialogData = {
  title?: string;
  confirmCallback: () => Observable<any>;
};
