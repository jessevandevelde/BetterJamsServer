import { io } from '../websocket/websocket';
import { getQueue } from '../queue/queue';
import { playTrack } from './play-current-track';

let currentPositionMs = 0;
const ONE_SECOND_IN_MS = 1000;
const queue = getQueue();

export function startTrackInterval(): NodeJS.Timeout {
  return setInterval(() => {
    currentPositionMs = currentPositionMs + ONE_SECOND_IN_MS;

    const currentTrack = queue.getCurrentTrack();

    if (!currentTrack) {
      return;
    }

    if (currentPositionMs >= currentTrack.durationMs) {
      io().emit('current-track', playTrack);
    }
  }, ONE_SECOND_IN_MS);
}

export function getCurrentPositionMs(): number {
  return currentPositionMs;
}
