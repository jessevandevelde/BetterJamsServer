import { io } from '../websocket/websocket';
import { getQueue } from '../queue/queue';
import { getCurrentPositionMs } from '../current-track/current-track';

export function emitCurrentTrackInformation(): void {
  const queue = getQueue();

  io().emit('current-track', { track: queue.getCurrentTrack(), progressMs: getCurrentPositionMs() });
}
