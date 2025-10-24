import type { QueueTrack, Track } from './queue.interfaces';

class Queue {
  private readonly queue: QueueTrack[] = [];

  public addToQueue(track: QueueTrack): void {
    this.queue.push(track);
    /* eslint-disable-next-line no-console */
    console.log('Track added:', this.queue);
  }

  public getFirstTrack(): Track | null {
    return this.queue.length > 0 ? this.queue[0] : null;
  }
}

const queue = new Queue();

export function getQueue(): Queue {
  return queue;
}
