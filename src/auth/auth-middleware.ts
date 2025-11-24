import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getCookieFromCookies } from '../helpers/cookies.helpers';
import { spotifyFetch } from '../helpers/spotify-fetch';

export async function isAuthorizedMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const excludedPaths = ['/login', '/callback', '/authenticated'];

  if (excludedPaths.some(path => req.path.startsWith(path))) {
    next();

    return;
  }

  try {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    const { access_token } = req.cookies;
    const refreshToken = getCookieFromCookies('refresh_token', req.cookies);
    const spotifyApiUrl = 'https://accounts.spotify.com/api/token';
    /* eslint-disable @typescript-eslint/naming-convention */
    const client_id = process.env.CLIENT_ID ?? '';
    const client_secret = process.env.CLIENT_SECRET ?? '';
    /* eslint-enable @typescript-eslint/naming-convention */

    if (!access_token) {
      console.log('test');
      console.log(refreshToken);

      if (refreshToken) {
        console.log('test 2');

        const response = await spotifyFetch(spotifyApiUrl, {
          method: 'POST',
          headers: {
            /* eslint-disable-next-line @typescript-eslint/naming-convention */
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            /* eslint-disable @typescript-eslint/naming-convention */
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: client_id,
            /* eslint-enable @typescript-eslint/naming-convention */
          }),
        });

        console.log(response);
      }

      throw new Error('Authorization failure, missing access_token');
    }

    next();
  }
  catch (_error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized: no access token' });
  }
}
