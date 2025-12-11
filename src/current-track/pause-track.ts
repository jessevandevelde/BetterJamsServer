import type { Request, Response } from 'express';
import { spotifyFetch } from '../helpers/spotify-fetch';
import { getCookieFromCookies } from '../helpers/cookies.helpers';
import { handleApiError, HttpErrorCause } from '../helpers/errors.helpers';
import { StatusCodes } from 'http-status-codes';

export async function pauseTrack(req: Request, res: Response): Promise<void> {
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  const access_token = getCookieFromCookies('access_token', req.cookies);

  try {
    const response = await spotifyFetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response) {
      throw new Error('Bad request', {
        cause: new HttpErrorCause(StatusCodes.BAD_REQUEST),
      });
    }

    res.status(StatusCodes.NO_CONTENT);
  }
  catch (error) {
    handleApiError(error, res);
  }
}
