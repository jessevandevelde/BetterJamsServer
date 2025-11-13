import { createReducer, on } from '@ngrx/store';
import type { QueueTrack, Track } from '../../types/track.interfaces';
import { RoomPageActions } from '.';
import type { User } from 'src/app/types/user.interfaces';
import { getUserProfileSuccess } from './room-page.actions';

export interface State {
  searchResults: Track[]
  searchIsLoading: boolean
  query: string
  searchHasError: boolean
  queueTracks: QueueTrack[]
  queueIsLoading: boolean
  queueHasError: boolean
  userIsLoading: boolean
  userHasError: boolean
  user: User | null
}

export const initialState: State = {
  searchResults: [],
  searchIsLoading: false,
  query: '',
  searchHasError: false,
  queueTracks: [],
  queueIsLoading: false,
  queueHasError: false,
  userIsLoading: false,
  userHasError: false,
  user: null,
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
    searchResults: [],
    query: '',
  })),

  on(RoomPageActions.setSearchQuery, (state, { query }): State => ({
    ...state,
    query,
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

  on(RoomPageActions.getUserProfile, (state): State => ({
    ...state,
    userIsLoading: true,
    userHasError: false,
  })),

  on(RoomPageActions.getUserProfileFailure, (state): State => ({
    ...state,
    userIsLoading: false,
    userHasError: true,
  })),

  on(getUserProfileSuccess, (state, { user }): State => ({
    ...state,
    userHasError: false,
    userIsLoading: false,
    user: user,
  })),
);
