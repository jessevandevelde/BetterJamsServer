/* eslint-disable @angular-eslint/prefer-inject,  @typescript-eslint/consistent-type-imports, @typescript-eslint/parameter-properties */
import { catchError, debounceTime, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { RoomPageActions, RoomPageSelectors } from '.';
import { RoomPageService } from '../room-page.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';

const DEBOUNCE_TIME = 500;

@Injectable({
  providedIn: 'root',
})
export class RoomPageEffects {
  public setSearchQuery$ = createEffect(() => {
    return this.actions.pipe(
      ofType(RoomPageActions.setSearchQuery),
      debounceTime(DEBOUNCE_TIME),
      map(({ query }) => RoomPageActions.searchTracks({ query })),
    );
  });

  public searchTrack$ = createEffect(() => {
    return this.actions.pipe(
      ofType(RoomPageActions.searchTracks),
      filter(({ query }) => !!query),
      switchMap(({ query }) => this.roomPageService.search(query).pipe(
        map((searchResults) => {
          return RoomPageActions.searchTracksSuccess({ searchResults });
        }),
        catchError((error: HttpErrorResponse) => of(RoomPageActions.searchTracksFailure({ error }))),
      )),
    );
  });

  public getQueue$ = createEffect(() => {
    return this.actions.pipe(
      ofType(RoomPageActions.getQueueTracks),
      switchMap(() => this.roomPageService.getQueue().pipe(
        map(({ queue }) => {
          return RoomPageActions.getQueueTracksSuccess({ queueTracks: queue });
        }),
        catchError((error: HttpErrorResponse) => of(RoomPageActions.getQueueTracksFailure({ error }))),
      )),
    );
  });

  public getUserProfile$ = createEffect(() => {
    return this.actions.pipe(
      ofType(RoomPageActions.getUserProfile),
      switchMap(() =>
        this.roomPageService.getUserProfile().pipe(
          map(user => RoomPageActions.getUserProfileSuccess({ user })),
          catchError((error: HttpErrorResponse) =>
            of(RoomPageActions.getUserProfileFailure({ error })),
          ),
        ),
      ),
    );
  });

  public getDevices$ = createEffect(() => {
    return this.actions.pipe(
      ofType(RoomPageActions.getDevices),
      switchMap(() => this.roomPageService.getAvailableDevices().pipe(
        map((devices) => {
          return RoomPageActions.getDevicesSuccess({ devices });
        }),
        catchError((error: HttpErrorResponse) => of(RoomPageActions.getDevicesFailure({ error }))),
      )),
    );
  });

  public playTrack$ = createEffect(() => {
    return this.actions.pipe(
      ofType(RoomPageActions.playTrack, RoomPageActions.setActiveDeviceId),
      withLatestFrom(
        this.store.select(RoomPageSelectors.selectActiveDeviceId),
        this.store.select(RoomPageSelectors.selectCurrentTrack),
      ),
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      filter(([_action, deviceId, currentTrack]) => !!deviceId && !!currentTrack),
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      switchMap(([_action, deviceId, _currentTrack]) => this.roomPageService.playTrack(deviceId).pipe(
        map(() => {
          return RoomPageActions.playTrackSuccess();
        }),
        catchError((error: HttpErrorResponse) => of(RoomPageActions.playTrackFailure({ error }))),
      )),
    );
  });

  public constructor(
    private readonly actions: Actions,
    private readonly roomPageService: RoomPageService,
    private readonly store: Store,
  ) {

  }
}
