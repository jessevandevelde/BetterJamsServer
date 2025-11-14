import type { Request, Response } from 'express';
import { getCookieFromCookies } from '../helpers/cookies.helpers';
import { spotifyFetch } from '../helpers/spotify-fetch';
import { handleApiError } from '../helpers/errors.helpers';
import type { DevicesResponse } from './devices.interfaces';
import { StatusCodes } from 'http-status-codes';

export async function getDevices(req: Request, res: Response): Promise<void> {
  const accessToken = getCookieFromCookies('access_token', req.cookies);

  if (!accessToken) {
    res.status(StatusCodes.UNAUTHORIZED);

    return;
  }

  try {
    const devices = await spotifyFetch<DevicesResponse | null>(
      'https://api.spotify.com/v1/me/player/devices',
      {
        method: 'GET',
        headers: {
          /* eslint-disable-next-line @typescript-eslint/naming-convention */
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!devices) {
      res.status(StatusCodes.NOT_FOUND);

      return;
    }

    res.status(StatusCodes.OK).json(devices);

    return;
  }
  catch (error: unknown) {
    handleApiError(error, res);

    return;
  }
}
