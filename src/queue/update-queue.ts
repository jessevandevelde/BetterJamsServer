import type { Request, Response } from 'express';
import { Queue } from './queue';
import type { Track } from './queue.interfaces';
import { QueueTrack } from './queue.interfaces';
import { StatusCodes } from 'http-status-codes';
import { handleApiError, HttpErrorCause } from '../helpers/errors.helpers';

const queue = new Queue();

export function updateQueue(req: Request<null, QueueTrack, Track | undefined>, res: Response): void {
  try {
    if (!req.body) {
      throw new Error('Missing track', { cause: new HttpErrorCause(StatusCodes.BAD_REQUEST) });
    }

    const queueTrack = new QueueTrack(req.body);

    queue.addToQueue(queueTrack);

    res.json(queueTrack);
  }
  catch (error) {
    handleApiError(error, res);
  }
}
