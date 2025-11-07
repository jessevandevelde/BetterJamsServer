import { StatusCodes } from 'http-status-codes';
import { getCookieFromCookies } from '../helpers/cookies.helpers';
import { getQueue } from '../queue/queue';
import type { QueueTrack } from '../queue/queue.interfaces';
import { getCurrentPositionMs } from './current-track';
import type { Request, Response } from 'express';
import { HttpErrorCause } from '../queue/update-queue';

async function playCurrentTrack(token: string, track: QueueTrack): Promise<void> {
  await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      /* eslint-disable @typescript-eslint/naming-convention */
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      /* eslint-enable @typescript-eslint/naming-convention */
    },

    body: JSON.stringify({
      uris: [track.uri],
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      position_ms: getCurrentPositionMs(),
    }),
  });
}

export async function playTrack(req: Request, res: Response): Promise<void> {
  const accessToken = getCookieFromCookies('access_token', req.cookies);
  const queue = getQueue();
  const { currentTrack } = queue;

  try {
    if (!currentTrack) {
      res.send('no current track defined');

      res.status(StatusCodes.NOT_FOUND);

      return;
    }

    await playCurrentTrack(accessToken, currentTrack);

    res.send({ status: 'OK' });
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
