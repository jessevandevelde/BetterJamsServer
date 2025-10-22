import { createReducer, on } from '@ngrx/store';
import type { Track } from '../../types/track.interfaces';
import { RoomPageActions } from '.';

export interface State {
  searchResults: Track[]
  searchIsLoading: boolean
  query: string
  searchHasError: boolean
}

export const initialState: State = {
  searchResults: [],
  searchIsLoading: false,
  query: '',
  searchHasError: false,
};

export const reducer = createReducer(
  initialState,

  on(RoomPageActions.searchTracks, (state): State => ({
    ...state,
    searchIsLoading: true,
    searchHasError: false,
    searchResults: [],
  })),

  on(RoomPageActions.searchTracksSuccess, (state, { searchResults }): State => ({
    ...state,
    searchIsLoading: false,
    searchResults,
    searchHasError: false,
  })),

  on(RoomPageActions.searchTracksFailure, (state): State => ({
    ...state,
    searchIsLoading: false,
    searchHasError: true,
    searchResults: [],
  })),

  on(RoomPageActions.resetSearchField, (state): State => ({
    ...state,
    searchIsLoading: false,
    query: '',
  })),

  on(RoomPageActions.setSearchQuery, (state, { query }): State => ({
    ...state,
    query,
  })),
);
