import { emitCurrentTrackInformation } from '../helpers/track.helpers';
import { getQueue } from '../queue/queue';

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
      currentPositionMs = 0;
      queue.setNextTrack();
      emitCurrentTrackInformation();
    }
  }, ONE_SECOND_IN_MS);
}

export function getCurrentPositionMs(): number {
  return currentPositionMs;
}
