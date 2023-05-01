import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

import { User } from '@/features/user';

export function bearerAuthenticationInterceptorFn(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const user = User.get();
  if (user) {
    request = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${user.token}`),
    });
  }
  return next(request);
}
