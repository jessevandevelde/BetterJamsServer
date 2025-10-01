import { createAction, props } from '@ngrx/store';
import type { Track } from '../search-bar.interfaces';
import type { HttpErrorResponse } from '@angular/common/http';

export const searchTracks = createAction(
  '[Search] searching tracks',
  props<{ query: string }>(),
);

export const searchTracksSuccess = createAction(
  '[Search] searched tracks successfully',
  props<{ tracks: Track[] }>(),
);

export const searchTracksFailure = createAction(
  '[Search], searching error',
  props<{ error: HttpErrorResponse }>(),
);
