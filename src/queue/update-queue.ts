import type { Request, Response } from 'express';
import { Queue } from './queue';
import type { QueueTrack } from './queue.interfaces';

const queue = new Queue();

export function updateQueue(req: Request, _res: Response): void {
  queue.addToQueue(req.body as QueueTrack);
}
