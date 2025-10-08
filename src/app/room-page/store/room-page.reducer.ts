import { createReducer, on } from '@ngrx/store';
import type { Track } from '../../components/search-bar/search-bar.interfaces';
import { RoomPageActions } from '.';

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

  on(RoomPageActions.searchTracks, (state, { query }): State => ({
    ...state,
    isLoading: true,
    hasError: false,
    query,
    tracks: [],
  })),

  on(RoomPageActions.searchTracksSuccess, (state, { tracks }): State => ({
    ...state,
    isLoading: false,
    tracks,
    hasError: false,
  })),

  on(RoomPageActions.searchTracksFailure, (state): State => ({
    ...state,
    isLoading: false,
    hasError: true,
    tracks: [],
  })),

  on(RoomPageActions.resetSearchField, (state): State => ({
    ...state,
    isLoading: false,
    query: '',
  })),
);
