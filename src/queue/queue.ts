import type { QueueTrack } from './queue.interfaces';

export class Queue {
  private readonly queue: QueueTrack[] = [];

  public addToQueue(track: QueueTrack): void {
    this.queue.push(track);
    /* eslint-disable-next-line no-console */
    console.log('Track added:', this.queue);
  }
}
