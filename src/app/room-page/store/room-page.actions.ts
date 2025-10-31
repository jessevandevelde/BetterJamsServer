import { createAction, props } from '@ngrx/store';
import type { QueueTrack, Track } from '../../types/track.interfaces';
import type { HttpErrorResponse } from '@angular/common/http';

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
  '[Queue] Get queue tracks',
);

export const getQueueTracksSuccess = createAction(
  '[Queue] Get queue tracks success',
  props<{ queueTracks: QueueTrack[] }>(),
);

export const getQueueTracksFailure = createAction(
  '[Queue] Get queue tracks failure',
  props<{ error: HttpErrorResponse }>(),
);
