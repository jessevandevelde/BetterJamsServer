import { inject } from '@angular/core';
import { Router } from '@angular/router';
import type { CanActivateFn } from '@angular/router';
import { RoomPageService } from './room-page/room-page.service';
import { map } from 'rxjs/operators';

export const isAuthenticatedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const roomPageService = inject(RoomPageService);

  return roomPageService.isAuthenticated().pipe(
    map((isAuth) => {
      return isAuth ? true : router.createUrlTree(['login']);
    }),
  );
};
