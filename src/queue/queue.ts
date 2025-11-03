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

  public static emitUpdateQueue(): void {
    io().emit(WebsocketEvent.queueUpdated);
  }

  public emitCurrentTrack(): void {
    io().emit(WebsocketEvent.currentTrack, {
      track: this._currentTrack,
    });
  }

  public addToQueue(track: QueueTrack): void {
    if (this.isQueueEmpty() && !this._currentTrack) {
      this.currentTrack = track;
      this.emitCurrentTrack();
    }
    else {
      this.queue.push(track);
      Queue.emitUpdateQueue();
    }
  }

  public setNextTrack(): void {
    if (this.isQueueEmpty()) {
      this.currentTrack = FALLBACK_TRACK;
      this.emitCurrentTrack();
    }
    else {
      /* eslint-disable-next-line @typescript-eslint/prefer-destructuring */
      const nextTrack = this.queue[0];

      this.queue.shift();
      this.currentTrack = nextTrack;
      Queue.emitUpdateQueue();
      this.emitCurrentTrack();
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
