import { inject } from '@angular/core';
import { Router } from '@angular/router';
import type { CanActivateFn } from '@angular/router';
import { RoomPageService } from './room-page/room-page.service';
import { of } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const roomPageService = inject(RoomPageService);

  console.log('ik kom erin');

  return of(true);
  // return roomPageService.isAuthenticated().pipe(
  //   tap((authenticated) => {
  //     console.log('guard');

  //     if (!authenticated) {
  //       router.navigate(['/login']);
  //     }
  //   }),
  //   map(authenticated => authenticated),
  // );
};
