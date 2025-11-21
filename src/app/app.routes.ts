import type { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { RoomPageComponent } from './room-page/room-page.component';
import { provideState } from '@ngrx/store';
import { reducer } from './room-page/store/room-page.reducer';
import { provideEffects } from '@ngrx/effects';
import { RoomPageEffects } from './room-page/store';
import { isAuthenticatedGuard } from './is-authenticated.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'room',
    component: RoomPageComponent,
    canActivate: [isAuthenticatedGuard],
    providers: [
      provideState('room-page', reducer),
      provideEffects(RoomPageEffects),
    ],
  },
  {
    path: '',
    redirectTo: 'room',
    pathMatch: 'full',
  },
];
