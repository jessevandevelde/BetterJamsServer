import type { QueueTrack } from '../types/track.interfaces';
import type { WebsocketEvent } from './websocket.enums';

export interface ServerToClientEvents {
  [WebsocketEvent.queueUpdated]: () => void
  [WebsocketEvent.currentTrack]: (track: QueueTrack) => void
  [WebsocketEvent.currentTrackProgress]: (durationMs: number) => void
}

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface ClientToServerEvents {
}
