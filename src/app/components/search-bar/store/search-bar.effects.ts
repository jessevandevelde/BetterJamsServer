import { map, switchMap } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { createEffect, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { SearchBarActions } from '.';
import { SearchBarService } from '../search-bar.service';

@Injectable({
  providedIn: 'root',
})
export class SearchBarEffects {
  public searchTrack$ = createEffect(() => {
    return this.actions.pipe(
      ofType(SearchBarActions.searchTracks),
      switchMap(({ query }) => this.searchBarService.search(query).pipe(
        map((tracks) => {
          return SearchBarActions.searchTracksSuccess ({ tracks });
        }),
      )),
    );
  });

  private readonly actions = inject(Actions);
  private readonly searchBarService: SearchBarService;

  public constructor() {
    this.searchBarService = inject(SearchBarService);
  }
}
