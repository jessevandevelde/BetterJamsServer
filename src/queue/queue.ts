import type { Track } from './queue.interfaces';
import type { QueueTrack } from './queue.interfaces';

class Queue {
  private readonly _queue: QueueTrack[] = [];
  private currentTrack: QueueTrack | null = null;

  public get queue(): QueueTrack[] {
    return this._queue;
  }

  public addToQueue(track: QueueTrack): void {
    this.queue.push(track);
    /* eslint-disable-next-line no-console */
    console.log('Track added:', this.queue);
  }

  public getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  public setNextTrack(): void {
    /* eslint-disable-next-line @typescript-eslint/prefer-destructuring */
    const firstItemInArray = this.queue[0];

    this.queue.shift();
    this.currentTrack = firstItemInArray;
    console.log('nextTrack:', this.currentTrack);
  }

  public hasNextTrack(): boolean {
    return this.queue.length > 0;
  }
}

const queue = new Queue();

export function getQueue(): Queue {
  return queue;
}
