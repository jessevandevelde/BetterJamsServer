import { createAction, props } from '@ngrx/store';
import type { QueueTrack, Track } from '../../types/track.interfaces';
import type { HttpErrorResponse } from '@angular/common/http';
import type { User } from 'src/app/types/user.interfaces';
import type { Device } from 'src/app/types/devices.interface';

export const searchTracks = createAction(
  '[Room page] Search tracks',
  props<{ query: string }>(),
);

export const searchTracksSuccess = createAction(
  '[Room page] Search tracks success',
  props<{ searchResults: Track[] }>(),
);

export const searchTracksFailure = createAction(
  '[Room page] Search tracks failure',
  props<{ error: HttpErrorResponse }>(),
);

export const resetSearchField = createAction(
  '[Room page] Reset search field',
);

export const setSearchQuery = createAction(
  '[Room page] Set search query',
  props<{ query: string }>(),
);

export const getQueueTracks = createAction(
  '[Room page] Get queue tracks',
);

export const getQueueTracksSuccess = createAction(
  '[Room page] Get queue tracks success',
  props<{ queueTracks: QueueTrack[] }>(),
);

export const getQueueTracksFailure = createAction(
  '[Room page] Get queue tracks failure',
  props<{ error: HttpErrorResponse }>(),
);

export const getUserProfile = createAction(
  '[Room page] get user profile',
);

export const getUserProfileFailure = createAction(
  '[Room page] get user profile failure',
  props<{ error: HttpErrorResponse }>(),
);

export const getUserProfileSuccess = createAction(
  '[Room page] get user profile success',
  props<{ user: User }>(),
);

export const getDevices = createAction(
  '[Room page] Get all available devices',
);

export const getDevicesFailure = createAction(
  '[Room page] Get devices failure',
  props<{ error: HttpErrorResponse }>(),
);

export const getDevicesSuccess = createAction(
  '[Room page] Get devices success',
  props<{ devices: Device[] }>(),
);

export const getActiveDevice = createAction(
  '[Room page] Get active device',
);

export const setActiveDeviceId = createAction(
  '[Room page] Set active device id',
  props<{ activeDeviceId: string }>(),
);

export const playTrack = createAction(
  '[Room page] Play track',
);

export const playTrackSuccess = createAction(
  '[Room page] Play track success',
);

export const playTrackFailure = createAction(
  '[Room page] play track failure',
  props<{ error: HttpErrorResponse }>(),
);

export const setCurrentTrack = createAction(
  '[Room page] Set current track',
  props<{ currentTrack: Track }>(),
);
