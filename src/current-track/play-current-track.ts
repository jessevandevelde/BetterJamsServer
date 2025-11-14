import { StatusCodes } from 'http-status-codes';
import { getCookieFromCookies } from '../helpers/cookies.helpers';
import { getQueue } from '../queue/queue';
import { getCurrentPositionMs } from './current-track';
import type { Request, Response } from 'express';
import { handleApiError, HttpErrorCause } from '../helpers/errors.helpers';
import { spotifyFetch } from '../helpers/spotify-fetch';

export async function playTrack(req: Request, res: Response): Promise<void> {
  const accessToken = getCookieFromCookies('access_token', req.cookies);
  const queue = getQueue();
  const { currentTrack } = queue;

  try {
    if (!currentTrack) {
      throw new Error('no current track defined', { cause: new HttpErrorCause(StatusCodes.BAD_REQUEST) });
    }

    await spotifyFetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
      /* eslint-disable @typescript-eslint/naming-convention */
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      /* eslint-enable @typescript-eslint/naming-convention */
      },

      body: JSON.stringify({
        uris: [currentTrack.uri],
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        position_ms: getCurrentPositionMs(),
      }),
    });

    res.status(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    handleApiError(error, res);
  }
}
