import type { Request, Response } from 'express';
import { Buffer } from 'node:buffer';
import type { AuthTokensResponse } from '../types/tokens.interface';
import { createCookie } from '../helpers/cookies.helpers';
import { spotifyFetch } from '../helpers/spotify-fetch';

export const callback = (
  spotifyUrl: string | undefined,
  clientId: string | undefined,
  clientSecret: string | undefined,
  redirectUri: string,
  clientUrl: string | undefined,
) => {
  return async (req: Request<null, null, null, { code: string, state: string }>, res: Response): Promise<void> => {
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

          res.redirect(clientUrl ?? '');
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
  };
};
