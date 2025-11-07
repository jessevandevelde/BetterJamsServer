import { getQueue } from '../queue/queue';
import { io } from '../websocket/websocket';
import { WebsocketEvent } from '../websocket/websocket.enums';

let currentPositionMs = 0;
const ONE_SECOND_IN_MS = 1000;

export let intervalStarted = false;

export function emitCurrentTrackProgress(): void {
  io().emit(WebsocketEvent.currentTrackProgress, currentPositionMs);
}

export function startTrackInterval(): void {
  intervalStarted = true;

  const queue = getQueue();

  setInterval(() => {
    const { currentTrack } = queue;

    if (!currentTrack) {
      return;
    }

    currentPositionMs = currentPositionMs + ONE_SECOND_IN_MS;

    emitCurrentTrackProgress();

    if (currentPositionMs >= currentTrack.durationMs) {
      currentPositionMs = 0;

      queue.setNextTrack();
    }
  }, ONE_SECOND_IN_MS);
}

export function getCurrentPositionMs(): number {
  return currentPositionMs;
}
