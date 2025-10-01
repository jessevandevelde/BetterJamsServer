/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/parameter-properties */
/* eslint-disable @angular-eslint/prefer-inject */
import { catchError, debounceTime, filter, map, of, switchMap } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { SearchBarActions } from '.';
import { SearchBarService } from '../search-bar.service';

const DEBOUNCE_TIME = 500;

@Injectable({
  providedIn: 'root',
})
export class SearchBarEffects {
  public searchTrack$ = createEffect(() => {
    return this.actions.pipe(
      ofType(SearchBarActions.searchTracks),
      debounceTime(DEBOUNCE_TIME),
      filter(({ query }) => !!query),
      switchMap(({ query }) => this.searchBarService.search(query).pipe(
        map((tracks) => {
          return SearchBarActions.searchTracksSuccess({ tracks });
        }),
      )),
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
      catchError(error => of(SearchBarActions.searchTracksFailure({ error }))),
    );
  });

  public constructor(
    private readonly actions: Actions,
    private readonly searchBarService: SearchBarService,
  ) {

  }
}
