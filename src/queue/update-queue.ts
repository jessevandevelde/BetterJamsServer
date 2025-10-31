import type { Request, Response } from 'express';
import { Queue } from './queue';
import type { Track } from './queue.interfaces';
import { QueueTrack } from './queue.interfaces';
import { StatusCodes } from 'http-status-codes';

export const queue = new Queue();

class HttpErrorCause {
  public code: number;

  public constructor(code: number) {
    this.code = code;
  }
}

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
    console.error(error);

    if (error instanceof Error) {
      const { cause } = error;

      if (cause instanceof HttpErrorCause) {
        res.status(cause.code).json({ error: error.message });
      }
      else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
      }
    }
  }
}
