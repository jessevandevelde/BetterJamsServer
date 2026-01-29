import type { Request, Response } from 'express';
import { getQueue } from './queue';
import type { Track } from './queue.interfaces';
import { QueueTrack } from './queue.interfaces';
import { StatusCodes } from 'http-status-codes';
import { handleApiError, HttpErrorCause } from '../helpers/errors.helpers';
import { getFallbackPlaylist } from './fallback-playlist';

export function updateQueue(req: Request<null, QueueTrack, Track | undefined>, res: Response): void {
  try {
    if (!req.body) {
      throw new Error('Missing track', { cause: new HttpErrorCause(StatusCodes.BAD_REQUEST) });
    }

    const queueTrack = new QueueTrack(req.body);
    const queue = getQueue();
    const playlist = getFallbackPlaylist();

    playlist.addTrackToPlaylist(req.body);

    queue.addToQueue(queueTrack);

    res.json(queueTrack);
  }
  catch (error) {
    handleApiError(error, res);
  }
}
