import type { Request, Response } from 'express';
import express from 'express';
import { randomBytes } from 'node:crypto';
import { Buffer } from 'node:buffer';
import querystring from 'node:querystring';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv';
import { createCookie } from './helpers/cookies.helpers';
import type { AuthTokensResponse } from './types/tokens.interface';

const env = dotenv.config();

dotenvExpand.expand(env);

const serverPort = process.env.SERVER_PORT;
const serverUrl = process.env.SERVER_URL;
const clientUrl = process.env.CLIENT_URL;
const spotifyUrl = process.env.SPOTIFY_API_URL;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = `${serverUrl}/callback`;
const app = express();

app.use(cookieParser());

app.use(cors ({
  origin: clientUrl,
  credentials: true,
}));

app.get('/', (_req: Request, res: Response) => {
  res.send('test');
});

app.get('/login', (_req: Request, res: Response) => {
  const stringLength = 16;
  const state = randomBytes(stringLength).toString('hex');
  const scope = 'user-read-private user-read-email';
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
});

app.get('/track', (req: Request, res: Response) => {
  const { track } = req.params;

  const dummySong = {
    name: track,
    artist: 'Playboi Dummy',
    url: `https://open.spotify.com/track/dummy-${track}`,
  };

  // eslint-disable-next-line no-console
  console.log(`Playing song: ${dummySong.name} by ${dummySong.artist}`);
  res.json(dummySong);
});

app.get('/callback', async (req: Request, res: Response) => {
  const code = typeof req.query.code === 'string' ? req.query.code : null;
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
      const response = await fetch(`${spotifyUrl}/api/token`, {
        method: 'POST',
        headers: {
          /* eslint-disable @typescript-eslint/naming-convention */
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve tokens', {
          cause: { status: response.status, statusText: response.statusText },
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      const data = await response.json() as AuthTokensResponse;

      if (data.access_token && data.refresh_token) {
        const oneSecondInMs = 1000;
        const oneMinuteInSeconds = 60;
        const oneHourInMinutes = 60;
        const maxAge = oneSecondInMs * oneMinuteInSeconds * oneHourInMinutes;

        createCookie(res, 'access_token', data.access_token, maxAge);
        createCookie(res, 'refresh_token', data.refresh_token);

        if (clientUrl) {
          res.redirect(clientUrl);
        }
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
});

app.listen(serverPort, () => {
  // eslint-disable-next-line no-console
  console.log(`Server draait op ${serverUrl}`);
});
