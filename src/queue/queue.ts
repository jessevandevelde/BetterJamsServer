import type { QueueTrack } from './queue.interfaces';

class Queue {
  private readonly queue: QueueTrack[] = [];

  public addToQueue(track: QueueTrack): void {
    this.queue.push(track);
    /* eslint-disable-next-line no-console */
    console.log('Track added:', this.queue);
  }
}

const queue = new Queue();

export function getQueue(): Queue {
  return queue;
}
