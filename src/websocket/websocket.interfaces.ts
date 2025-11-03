import type { QueueTrack } from '../queue/queue.interfaces';
import type { WebsocketEvent } from './websocket.enums';

export interface ServerToClientEvents {
  [WebsocketEvent.queueUpdated]: () => void
  [WebsocketEvent.currentTrack]: (data: { track: QueueTrack, progressMs: number }) => void
}

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface ClientToServerEvents {
}
