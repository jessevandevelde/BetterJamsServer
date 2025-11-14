import type { Request, Response } from 'express';
import { getQueue } from './queue';

export function upvoteTrack(req: Request<null, null, { userId: string, trackUuid: string }>, res: Response): void {
  try {
    const queue = getQueue();

    if (!queue.queue.length || !queue.getTrack(req.body.trackUuid)) {
      throw new Error();
    }

    queue.upvoteTrack(req.body.userId, req.body.trackUuid);

    res.status(204);
  }
  catch (_error) {
    res.status(500);
  }
}
