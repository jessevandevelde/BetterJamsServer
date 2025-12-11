import type { Request, Response } from 'express';
import { getCookieFromCookies } from '../helpers/cookies.helpers';
import { spotifyFetch } from '../helpers/spotify-fetch';
import { handleApiError } from '../helpers/errors.helpers';
import { StatusCodes } from 'http-status-codes';
import type { DevicesResponse } from './devices.interfaces';
import { Device } from './devices.interfaces';

export async function getDevices(req: Request, res: Response<Device[]>): Promise<void> {
  const accessToken = getCookieFromCookies('access_token', req.cookies);

  try {
    const response = await spotifyFetch<DevicesResponse | null>(
      'https://api.spotify.com/v1/me/player/devices',
      {
        method: 'GET',
        headers: {
          /* eslint-disable-next-line @typescript-eslint/naming-convention */
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response) {
      res.status(StatusCodes.NOT_FOUND);

      return;
    }

    const devicesResponse = response.devices.map(device => new Device(device));

    res.status(StatusCodes.OK).json(devicesResponse);
  }
  catch (error: unknown) {
    handleApiError(error, res);
  }
}
