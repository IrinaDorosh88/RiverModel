import { Subject } from 'rxjs';

export const TOOLBAR_ACTION$$ = new Subject<{
  key: string;
  params: any[];
}>();
