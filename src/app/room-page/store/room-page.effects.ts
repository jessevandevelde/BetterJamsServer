/* eslint-disable @typescript-eslint/parameter-properties */
/* eslint-disable @angular-eslint/prefer-inject */
import { catchError, debounceTime, filter, map, of, switchMap } from 'rxjs';
/* eslint-disable-next-line @typescript-eslint/consistent-type-imports */
import { Actions } from '@ngrx/effects';
import { createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { RoomPageActions } from '.';
/* eslint-disable-next-line @typescript-eslint/consistent-type-imports */
import { RoomPageService } from '../room-page.service';
import type { HttpErrorResponse } from '@angular/common/http';

const DEBOUNCE_TIME = 500;

@Injectable({
  providedIn: 'root',
})
export class RoomPageEffects {
  public searchTrack$ = createEffect(() => {
    return this.actions.pipe(
      ofType(RoomPageActions.searchTracks),
      debounceTime(DEBOUNCE_TIME),
      filter(({ query }) => !!query),
      switchMap(({ query }) => this.searchBarService.search(query).pipe(
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
      switchMap(() => this.searchBarService.getQueue().pipe(
        map(({ queue }) => {
          return RoomPageActions.getQueueTracksSuccess({ queueTracks: queue });
        }),
        catchError((error: HttpErrorResponse) => of(RoomPageActions.getQueueTracksFailure({ error }))),
      )),
    );
  });

  public constructor(
    private readonly actions: Actions,
    private readonly searchBarService: RoomPageService,
  ) {

  }
}
