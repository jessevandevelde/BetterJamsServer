import { createReducer, on } from '@ngrx/store';
import type { Track } from '../../types/track.interfaces';
import { RoomPageActions } from '.';

export interface State {
  searchResults: Track[]
  isLoading: boolean
  query: string
  hasError: boolean
  queueTracks: Track[]
  queueIsLoading: boolean
  queueHasError: boolean
}

export const initialState: State = {
  searchResults: [],
  isLoading: false,
  query: '',
  hasError: false,
  queueTracks: [],
  queueIsLoading: false,
  queueHasError: false,
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

  on(RoomPageActions.getQueueTracks, (state): State => ({
    ...state,
    queueHasError: false,
    queueIsLoading: true,
  })),

  on(RoomPageActions.getQueueTracksSuccess, (state, { queueTracks }): State => ({
    ...state,
    queueIsLoading: false,
    queueTracks,
  })),

  on(RoomPageActions.getQueueTracksFailure, (state): State => ({
    ...state,
    queueHasError: true,
    queueIsLoading: false,
  })),

);
