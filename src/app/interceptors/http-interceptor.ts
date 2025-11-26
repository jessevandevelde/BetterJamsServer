import type { HttpErrorResponse } from '@angular/common/http';
import { HttpEventType, HttpStatusCode, type HttpHandlerFn, type HttpInterceptorFn, type HttpRequest } from '@angular/common/http';
import { catchError, filter, switchMap, throwError } from 'rxjs';
import { RoomPageService } from '../room-page/room-page.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const httpInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const roomPageService = inject(RoomPageService);
  const router = inject(Router);

  return next(req).pipe(
    filter(event => event.type === HttpEventType.Response),
    catchError((error: HttpErrorResponse) => {
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison */
      if (error.status === HttpStatusCode.Unauthorized) {
        if (req.url.includes('/auth/refresh')) {
          void router.navigate(['/login']);
        }

        return roomPageService.refresh().pipe(
          switchMap(() => {
            const requestToTry = req.clone();

            return next(requestToTry);
          }),
          catchError((_error: HttpErrorResponse) => {
            void router.navigate(['/login']);

            return throwError(() => _error);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
