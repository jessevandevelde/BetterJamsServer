import type { QueueTrack } from '../queue/queue.interfaces';
import type { WebsocketEvent } from './websocket.enums';

export interface ServerToClientEvents {
  [WebsocketEvent.queueUpdated]: () => void
  [WebsocketEvent.currentTrack]: (track: QueueTrack) => void
  [WebsocketEvent.currentTrackProgress]: (currentPositionMs: number) => void
}

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface ClientToServerEvents {
}
