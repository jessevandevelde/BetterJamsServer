import { createReducer, on } from '@ngrx/store';
import type { QueueTrack, Track } from '../../types/track.interfaces';
import { RoomPageActions } from '.';
import type { SpotifyDevice } from 'src/app/types/devices.interface';

export interface State {
  searchResults: Track[]
  searchIsLoading: boolean
  query: string
  searchHasError: boolean
  queueTracks: QueueTrack[]
  queueIsLoading: boolean
  queueHasError: boolean
  devices: SpotifyDevice[]
  devicesHasError: boolean
}

export const initialState: State = {
  searchResults: [],
  searchIsLoading: false,
  query: '',
  searchHasError: false,
  queueTracks: [],
  queueIsLoading: false,
  queueHasError: false,
  devices: [],
  devicesHasError: false,
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

  on(RoomPageActions.getDevices, (state): State => ({
    ...state,
    devicesHasError: false,
  })),

  on(RoomPageActions.getDevicesFailure, (state): State => ({
    ...state,
    devicesHasError: true,
    devices: [],
  })),

  on(RoomPageActions.getDevicesSuccess, (state, { devices }): State => ({
    ...state,
    devices,
    devicesHasError: false,
  })),
);
