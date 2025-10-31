import { io } from '../websocket/websocket';
import { getQueue } from '../queue/queue';
import { getCurrentPositionMs } from '../current-track/current-track';
import { WebsocketEvent } from '../websocket/websocket.enums';

export function emitCurrentTrackInformation(): void {
  const queue = getQueue();

  io().emit(WebsocketEvent.currentTrack, { track: queue.currentTrack, progressMs: getCurrentPositionMs() });
}
