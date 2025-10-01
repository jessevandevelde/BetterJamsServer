import type { State } from './search-bar.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectSearchBarState = createFeatureSelector<State>('search');

export const selectTracks = createSelector(
  selectSearchBarState,
  state => state.tracks,
);

export const selectQuery = createSelector(
  selectSearchBarState,
  state => state.query,
);

export const selectIsLoading = createSelector(
  selectSearchBarState,
  state => state.isLoading,
);

export const selectHasError = createSelector(
  selectSearchBarState,
  state => state.hasError,
);
