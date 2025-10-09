import { createAction, props } from '@ngrx/store';
import type { Track } from '../../types/track.interfaces';
import type { HttpErrorResponse } from '@angular/common/http';

export const searchTracks = createAction(
  '[Search] searching tracks',
  props<{ query: string }>(),
);

export const searchTracksSuccess = createAction(
  '[Search] searched tracks successfully',
  props<{ searchResults: Track[] }>(),
);

export const searchTracksFailure = createAction(
  '[Search], searching error',
  props<{ error: HttpErrorResponse }>(),
);

export const resetSearchField = createAction(
  '[Search], reset',
);
