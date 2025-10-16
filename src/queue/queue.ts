import type { QueueTrack } from './queue.interfaces';

export class Queue {
  private readonly queue: QueueTrack[] = [];

  public addToQueue(track: QueueTrack): void {
    this.queue.push(track);
    console.log('Track added:', track);
  }
  // get queue
}
