import { createReducer, on } from '@ngrx/store';
import type { Track } from '../../components/search-bar/search-bar.interfaces';
import { RoomPageActions } from '.';

export interface State {
  searchResults: Track[]
  isLoading: boolean
  query: string
  hasError: boolean
}

export const initialState: State = {
  searchResults: [],
  isLoading: false,
  query: '',
  hasError: false,
};

export const reducer = createReducer(
  initialState,

  on(RoomPageActions.searchTracks, (state, { query }): State => ({
    ...state,
    isLoading: true,
    hasError: false,
    query,
    searchResults: [],
  })),

  on(RoomPageActions.searchTracksSuccess, (state, { searchResults }): State => ({
    ...state,
    isLoading: false,
    searchResults,
    hasError: false,
  })),

  on(RoomPageActions.searchTracksFailure, (state): State => ({
    ...state,
    isLoading: false,
    hasError: true,
    searchResults: [],
  })),

  on(RoomPageActions.resetSearchField, (state): State => ({
    ...state,
    isLoading: false,
    query: '',
  })),
);
