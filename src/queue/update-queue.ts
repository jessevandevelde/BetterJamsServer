import type { Request, Response } from 'express';
import { Queue } from './queue';
import type { Track } from './queue.interfaces';
import { QueueTrack } from './queue.interfaces';

const queue = new Queue();

export function updateQueue(req: Request<null, QueueTrack, Track>, res: Response): void {
  const queueTrack = new QueueTrack(req.body);

  queue.addToQueue(queueTrack);

  res.json(queueTrack);
}
