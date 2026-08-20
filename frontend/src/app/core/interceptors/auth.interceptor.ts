import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

let isRefreshing = false;
const refreshDone$ = new BehaviorSubject<boolean | null>(null);

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const request = req.clone({ withCredentials: true });
  const isPublic = PUBLIC_PATHS.some((path) => req.url.includes(path));

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !isPublic) {
        return refreshAndRetry(request, next, http);
      }
      return throwError(() => error);
    }),
  );
};

function refreshAndRetry(
  request: Parameters<HttpInterceptorFn>[0],
  next: Parameters<HttpInterceptorFn>[1],
  http: HttpClient,
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshDone$.next(null);

    return http.post(environment.apiUrl + '/auth/refresh', {}, { withCredentials: true }).pipe(
      switchMap(() => {
        isRefreshing = false;
        refreshDone$.next(true);
        return next(request);
      }),
      catchError((err) => {
        isRefreshing = false;
        refreshDone$.next(false);
        return throwError(() => err);
      }),
    );
  }

  return refreshDone$.pipe(
    filter((done) => done !== null),
    take(1),
    switchMap((success) => (success ? next(request) : throwError(() => new Error('Session expirée')))),
  );
}