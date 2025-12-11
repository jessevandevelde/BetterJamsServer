import type { Request, Response } from 'express';
import type { AuthTokensResponse } from '../types/tokens.interface';
import { spotifyFetch } from '../helpers/spotify-fetch';
import { createCookie } from '../helpers/cookies.helpers';

/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
const clientId = process.env.CLIENT_ID as string;
const spotifyUrl = process.env.SPOTIFY_ACCOUNT_URL as string;
const clientUrl = process.env.CLIENT_URL as string;
const serverUrl = process.env.SERVER_URL as string;
const clientSecret = process.env.CLIENT_SECRET as string;
const redirectUri = `${serverUrl}/auth/callback`;
/* eslint-enable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-enable @typescript-eslint/non-nullable-type-assertion-style */

export async function callback(req: Request, res: Response): Promise<void> {
  const code = typeof req.query.code === 'string'
    ? req.query.code
    : null;

  const { state } = req.cookies;

  if (state === null || state !== req.query.state) {
    res.redirect(`${clientUrl}/login?error=state_mismatch`);
  }
  else {
    const params = new URLSearchParams();

    if (code) {
      params.append('code', code);
    }

    params.append('redirect_uri', redirectUri);
    params.append('grant_type', 'authorization_code');

    try {
      const response = await spotifyFetch<AuthTokensResponse>(`${spotifyUrl}/api/token`, {
        method: 'POST',
        headers: {
          /* eslint-disable @typescript-eslint/naming-convention */
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        body: params.toString(),
      });

      const data = response;

      if (!data) {
        throw new Error();
      }

      if (data.access_token && data.refresh_token) {
        const oneSecondInMs = 1000;
        const oneMinuteInSeconds = 60;
        const oneHourInMinutes = 60;
        const maxAge = oneSecondInMs * oneMinuteInSeconds * oneHourInMinutes;

        createCookie(res, 'access_token', data.access_token, maxAge);
        createCookie(res, 'refresh_token', data.refresh_token);

        res.redirect(clientUrl);
      }
      else {
        throw new Error('Failed to retrieve tokens');
      }
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      res.redirect(`${clientUrl}/login?error=unauthorized`);
    }
  }
}

;
