import type { Request, Response } from 'express';
import { createCookie } from '../helpers/cookies.helpers';
import { randomBytes } from 'node:crypto';
import querystring from 'node:querystring';

export function login(_req: Request, res: Response): void {
  const stringLength = 16;
  const state = randomBytes(stringLength).toString('hex');
  const scope = 'user-read-private user-read-email user-modify-playback-state user-read-playback-state';
  const oneMinuteInSeconds = 60;
  const oneSecondInMs = 1000;
  const maxAge = oneMinuteInSeconds * oneSecondInMs;

  /* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
  /* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
  const clientId = process.env.CLIENT_ID as string;
  const serverUrl = process.env.SERVER_URL as string;
  const spotifyUrl = process.env.SPOTIFY_ACCOUNT_URL as string;
  /* eslint-enable @typescript-eslint/no-unsafe-type-assertion */
  /* eslint-enable @typescript-eslint/non-nullable-type-assertion-style */

  const redirectUri = `${serverUrl}/auth/callback`;

  createCookie(res, 'state', state, maxAge);

  res.redirect(`${spotifyUrl}/authorize?`
    + querystring.stringify({
      /* eslint-disable @typescript-eslint/naming-convention */
      response_type: 'code',
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      state,
      /* eslint-enable @typescript-eslint/naming-convention */
    }));
}
