import { getCurrentPositionMs } from '../current-track/current-track';
import { io } from '../websocket/websocket';
import { WebsocketEvent } from '../websocket/websocket.enums';
import type { QueueTrack } from './queue.interfaces';

const FALLBACK_TRACK: QueueTrack = {
  upvoteIds: [],
  albumCoverUrl: 'https://i.scdn.co/image/ab67616d0000b273ea5c803c889b985833ae8b8e',
  artists: 'CHASETHEMONEY, LUCKI',
  durationMs: 66612,
  id: '76ZOzwf0oSiS69NOw8r8Nx',
  name: 'Interlude',
  uri: 'spotify:track:76ZOzwf0oSiS69NOw8r8Nx',
};

class Queue {
  private readonly _queue: QueueTrack[] = [];
  private _currentTrack: QueueTrack | null = null;

  public get queue(): QueueTrack[] {
    return this._queue;
  }

  public get currentTrack(): QueueTrack | null {
    return this._currentTrack;
  }

  private set currentTrack(track: QueueTrack | null) {
    this._currentTrack = track;
  }

  public addToQueue(track: QueueTrack): void {
    if (this.isQueueEmpty() && !this._currentTrack) {
      this.currentTrack = track;
      io().emit(WebsocketEvent.currentTrack, { track: this.currentTrack, progressMs: getCurrentPositionMs() });
    }
    else {
      this.queue.push(track);
      io().emit(WebsocketEvent.queueUpdated);
    }
  }

  public setNextTrack(): void {
    if (this.isQueueEmpty()) {
      this.currentTrack = FALLBACK_TRACK;
      io().emit(WebsocketEvent.currentTrack, { track: this.currentTrack, progressMs: getCurrentPositionMs() });
    }
    else {
      /* eslint-disable-next-line @typescript-eslint/prefer-destructuring */
      const firstItemInArray = this.queue[0];

      this.queue.shift();
      this.currentTrack = firstItemInArray;
      io().emit(WebsocketEvent.queueUpdated);
      io().emit(WebsocketEvent.currentTrack, { track: this.currentTrack, progressMs: getCurrentPositionMs() });
    }
  }

  public isQueueEmpty(): boolean {
    return !this.queue.length;
  }
}

const queue = new Queue();

export function getQueue(): Queue {
  return queue;
}
