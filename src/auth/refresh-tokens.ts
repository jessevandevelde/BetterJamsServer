import type { Request, Response } from 'express';
import { createCookie, getCookieFromCookies } from '../helpers/cookies.helpers';
import { spotifyFetch } from '../helpers/spotify-fetch';
import type { RefreshTokenResponse } from '../types/refresh-token-response.interface';
import { handleApiError, HttpErrorCause } from '../helpers/errors.helpers';
import { StatusCodes } from 'http-status-codes';

export async function refreshTokens(req: Request, res: Response): Promise<void> {
  const refreshToken = getCookieFromCookies('refresh_token', req.cookies);

  try {
    /* eslint-disable @typescript-eslint/naming-convention */
    const client_id = process.env.CLIENT_ID ?? '';
    const client_secret = process.env.CLIENT_SECRET ?? '';
    const spotifyApiUrl = 'https://accounts.spotify.com/api/token';

    /* eslint-enable @typescript-eslint/naming-convention */

    const data = await spotifyFetch<RefreshTokenResponse>(spotifyApiUrl, {
      method: 'POST',
      headers: {
        /* eslint-disable @typescript-eslint/naming-convention */
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
        /* eslint-enable @typescript-eslint/naming-convention */
      },
      body: new URLSearchParams({
        /* eslint-disable @typescript-eslint/naming-convention */
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: client_id,
        /* eslint-enable @typescript-eslint/naming-convention */
      }),
    });

    if (!data) {
      throw new Error('No data', { cause: new HttpErrorCause(StatusCodes.UNAUTHORIZED) });
    }

    const secondInMs = 1000;
    const accessTokenMaxAgeInMs = data.expires_in * secondInMs;

    createCookie(res, 'access_token', data.access_token, accessTokenMaxAgeInMs);

    if (data.refresh_token) {
      createCookie(res, 'refresh_token', data.refresh_token);
    }

    res.status(StatusCodes.NO_CONTENT).send();
  }
  catch (error) {
    console.error(error);

    /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion */
    handleApiError(error as Error, res);
  }
}
