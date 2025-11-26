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
  dateAdded: '',
  uuid: crypto.randomUUID(),
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

  private static sortQueue(queue: QueueTrack[]): QueueTrack[] {
    return queue.sort((a, b) => {
      return b.upvoteIds.length - a.upvoteIds.length || Date.parse(a.dateAdded) - Date.parse(b.dateAdded);
    });
  }

  public emitCurrentTrack(): void {
    if (!this._currentTrack) {
      return;
    }

    io().emit(WebsocketEvent.currentTrack,
      this._currentTrack,
    );
  }

  public getTrack(trackUUID: string): QueueTrack | undefined {
    return this.queue.find(track => track.uuid === trackUUID);
  }

  public upvoteTrack(userId: string, trackUUID: string): void {
    const trackToUpvote = this.getTrack(trackUUID);

    if (!trackToUpvote) {
      return;
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
    trackToUpvote.upvoteIds.includes(userId)
      ? trackToUpvote.upvoteIds.splice(trackToUpvote.upvoteIds.indexOf(userId), 1)
      : trackToUpvote.upvoteIds.push(userId);

    const trackToUpvoteIndex = this.queue.findIndex(track => track.uuid === trackUUID);

    this.queue[trackToUpvoteIndex] = trackToUpvote;

    Queue.sortQueue(this.queue);
    Queue.emitUpdateQueue();
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

  private isQueueEmpty(): boolean {
    return !this.queue.length;
  }
}

const queue = new Queue();

export function getQueue(): Queue {
  return queue;
}
