import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getQueue } from './queue';
import { handleApiError, HttpErrorCause } from '../helpers/errors.helpers';

export function upvoteTrack(req: Request<null, null, { userId: string, trackUuid: string }>, res: Response): void {
  try {
    const queue = getQueue();

    const track = queue.getTrack(req.body.trackUuid);

    if (!queue.queue.length || !track) {
      throw new Error('track not found', {
        cause: new HttpErrorCause(StatusCodes.BAD_REQUEST),
      });
    }

    queue.upvoteTrack(req.body.userId, req.body.trackUuid);

    res.send(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    handleApiError(error, res);
  }
}
