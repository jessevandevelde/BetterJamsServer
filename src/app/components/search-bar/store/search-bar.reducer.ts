import { createReducer, on } from '@ngrx/store';
import type { Track } from '../search-bar.interfaces';
import { SearchBarActions } from '.';

export interface State {
  tracks: Track[]
  isLoading: boolean
  query: string
  hasError: boolean
}

export const initialState: State = {
  tracks: [],
  isLoading: false,
  query: '',
  hasError: false,
};

export const reducer = createReducer(
  initialState,

  on(SearchBarActions.searchTracks, (state): State => ({
    ...state,
    isLoading: true,
    hasError: false,
  })),

  on(SearchBarActions.searchTracksSuccess, (state, { tracks }): State => ({
    ...state,
    isLoading: false,
    tracks,
    hasError: false,
  })),

  on(SearchBarActions.searchTracksFailure, (state): State => ({
    ...state,
    isLoading: false,
    hasError: true,
  })),
);
