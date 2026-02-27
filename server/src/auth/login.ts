import type { Request, Response } from 'express';
import { randomBytes } from 'node:crypto';
import querystring from 'node:querystring';
import { createCookie } from '../helpers/cookies.helpers';

export const login = (spotifyUrl: string | undefined, redirectUri: string, clientId: string | undefined) => {
  return (_req: Request, res: Response): void => {
    const stringLength = 16;
    const state = randomBytes(stringLength).toString('hex');
    const scope = 'user-read-private user-read-email user-modify-playback-state user-read-playback-state';
    const oneMinuteInSeconds = 60;
    const oneSecondInMs = 1000;
    const maxAge = oneMinuteInSeconds * oneSecondInMs;

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
  };
};
