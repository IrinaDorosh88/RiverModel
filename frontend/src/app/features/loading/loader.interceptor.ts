import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

import { LOADING$$ } from './loader.models';

export const loaderInterceptorFn: HttpInterceptorFn = (() => {
  let totalRequests = 0;
  return (req, next) => {
    if (!totalRequests++) LOADING$$.next(true);
    return next(req).pipe(
      finalize(() => {
        if (!--totalRequests) LOADING$$.next(false);
      })
    );
  };
})();
