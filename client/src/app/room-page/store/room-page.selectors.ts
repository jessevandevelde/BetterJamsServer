import type { State } from './room-page.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectRoomPageState = createFeatureSelector<State>('room-page');

export const selectSearchResults = createSelector(
  selectRoomPageState,
  state => state.searchResults,
);

export const selectQuery = createSelector(
  selectRoomPageState,
  state => state.query,
);

export const selectSearchIsLoading = createSelector(
  selectRoomPageState,
  state => state.searchIsLoading,
);

export const selectSearchHasError = createSelector(
  selectRoomPageState,
  state => state.searchHasError,
);

export const selectQueueTracks = createSelector(
  selectRoomPageState,
  state => state.queueTracks,
);

export const selectUserIsLoading = createSelector(
  selectRoomPageState,
  state => state.userIsLoading,
);

export const selectUserHasError = createSelector(
  selectRoomPageState,
  state => state.userHasError,
);

export const selectUserHasData = createSelector(
  selectRoomPageState,
  state => state.user,
);

export const selectDevices = createSelector(
  selectRoomPageState,
  state => state.devices,
);

export const selectDevicesHasLoaded = createSelector(
  selectRoomPageState,
  state => state.devicesHasLoaded,
);

export const selectActiveDeviceId = createSelector(
  selectRoomPageState,
  state => state.activeDeviceId,
);

export const selectDevicesIsLoading = createSelector(
  selectRoomPageState,
  state => state.devicesIsLoading,
);

export const selectCurrentTrack = createSelector(
  selectRoomPageState,
  state => state.currentTrack,
);
