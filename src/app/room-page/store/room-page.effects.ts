/* eslint-disable @angular-eslint/prefer-inject,  @typescript-eslint/consistent-type-imports, @typescript-eslint/parameter-properties */
import { catchError, debounceTime, filter, map, of, switchMap } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { RoomPageActions } from '.';
import { RoomPageService } from '../room-page.service';

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
      )),
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
      catchError(error => of(RoomPageActions.searchTracksFailure({ error }))),
    );
  });

  public constructor(
    private readonly actions: Actions,
    private readonly searchBarService: RoomPageService,
  ) {

  }
}
