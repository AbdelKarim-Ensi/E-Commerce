import { HttpInterceptorFn } from '@angular/common/http';
import { inject, REQUEST } from '@angular/core';

export const ssrCookieInterceptor: HttpInterceptorFn = (req, next) => {
  const incomingRequest = inject(REQUEST, { optional: true });
  const cookie = incomingRequest?.headers.get('cookie');

  if (!cookie) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { cookie },
    })
  );
};