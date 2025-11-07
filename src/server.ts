import type { Request, Response } from 'express';
import express, { json } from 'express';
import { randomBytes } from 'node:crypto';
import { Buffer } from 'node:buffer';
import querystring from 'node:querystring';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv';
import { createCookie } from './helpers/cookies.helpers';
import type { AuthTokensResponse } from './types/tokens.interface';
import queueRoutes from './queue';
import { isAuthorizedMiddleware } from './auth/auth-middleware';
import { StatusCodes } from 'http-status-codes';
import getUserRoutes from './user';

const env = dotenv.config();

dotenvExpand.expand(env);

/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
const serverPort = process.env.SERVER_PORT as string;
const serverUrl = process.env.SERVER_URL as string;
const clientUrl = process.env.CLIENT_URL as string;
const spotifyUrl = process.env.SPOTIFY_ACCOUNT_URL as string;
const clientId = process.env.CLIENT_ID as string;
const clientSecret = process.env.CLIENT_SECRET as string;
const redirectUri = `${serverUrl}/callback`;
const spotifyApiUrl = process.env.SPOTIFY_API_URL as string;
const app = express();
/* eslint-enable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */

app.use(cookieParser());

app.use(cors ({
  origin: clientUrl,
  credentials: true,
}));

app.use(json());

app.use(isAuthorizedMiddleware);

app.use('/queue', queueRoutes);

app.use('/user', getUserRoutes);

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

      const data = await response.json() as AuthTokensResponse;

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
});

app.get('/search', async (req: Request, res: Response): Promise<Response> => {
  const query = req.query.query as string | undefined;

  if (!query) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Missing search query' });
  }

  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  const { access_token } = req.cookies;

  try {
    const response = await fetch(
      `${spotifyApiUrl}/search?${querystring.stringify({
        q: query,
        type: 'track',
        limit: 20,
      })}`,
      {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Spotify API error: ${response.statusText}`,
      });
    }

    const data: unknown = await response.json();

    return res.json(data);
  }
  catch (err) {
    console.error(err);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to search Spotify API' });
  }
});

if (clientId && serverPort && serverUrl && clientUrl && clientSecret) {
  app.listen(serverPort, () => {
  // eslint-disable-next-line no-console
    console.log(`Server draait op ${serverUrl}`);
  });
}
else {
  console.warn(`missing parameters 
    clientId: ${clientId},
    serverPort: ${serverPort},
    serverUrl: ${serverUrl},
    clientUrl: ${clientUrl},
    clientSecret: ${clientSecret}`);
}
