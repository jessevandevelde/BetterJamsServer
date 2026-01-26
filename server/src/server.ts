import type { Request, Response } from 'express';
import express, { json } from 'express';
import { randomBytes } from 'node:crypto';
import { Buffer } from 'node:buffer';
import querystring from 'node:querystring';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv';
import * as path from 'node:path';
import { createCookie } from './helpers/cookies.helpers';
import type { AuthTokensResponse } from './types/tokens.interface';
import queueRoutes from './queue';
import deviceRoutes from './devices';
import currentTrackRoutes from './current-track';
import { isAuthorizedMiddleware } from './auth/auth-middleware';
import { StatusCodes } from 'http-status-codes';
import { startWebsocket } from './websocket/websocket';
import http from 'http';
import userRoutes from './user';
import { handleApiError, HttpErrorCause } from './helpers/errors.helpers';
import { spotifyFetch } from './helpers/spotify-fetch';
import isAuthenticatedRoutes from './is-authenticated';
import authRoutes from './auth';

const env = dotenv.config();

dotenvExpand.expand(env);

/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
const serverPort = process.env.SERVER_PORT as string;
const serverUrl = process.env.SERVER_URL as string;
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
  origin: serverUrl,
  credentials: true,
}));

app.use(json());

app.use(isAuthorizedMiddleware);

app.use('/auth', authRoutes);
app.use('/authenticated', isAuthenticatedRoutes);
app.use('/devices', deviceRoutes);
app.use('/queue', queueRoutes);
app.use('/current-track', currentTrackRoutes);
app.use('/user', userRoutes);

app.get('/login', (_req: Request, res: Response) => {
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
    res.redirect(`${serverUrl}/login?error=state_mismatch`);
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

        res.redirect(serverUrl);
      }
      else {
        throw new Error('Failed to retrieve tokens');
      }
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      res.redirect(`${serverUrl}/login?error=unauthorized`);
    }
  }
});

app.get('/search', async (req: Request, res: Response): Promise<void> => {
  const query = req.query.query as string | undefined;

  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  const { access_token } = req.cookies;

  try {
    if (!query) {
      throw new Error('Missing search query', { cause: new HttpErrorCause(StatusCodes.BAD_REQUEST) });
    }

    const url = `${spotifyApiUrl}/search?${querystring.stringify({
      q: query,
      type: 'track',
      limit: 20,
    })}`;

    const response = await spotifyFetch(url,
      {
        method: 'GET',
        headers: {
          /* eslint-disable-next-line @typescript-eslint/naming-convention */
          Authorization: `Bearer ${access_token}`,
        },
      });

    res.json(response);
  }

  catch (error) {
    handleApiError(error, res);
  }
});

const angularDist: string = path.resolve(__dirname, '../../client/dist/browser');

app.use(express.static(angularDist));

app.use((req, res, next) => {
  if (req.method !== 'GET') {
    next();

    return;
  }

  if (req.path.startsWith('/api')) {
    next();

    return;
  }

  res.sendFile(path.join(angularDist, 'index.html'));
});

const server = http.createServer(app);

if (clientId && serverPort && serverUrl && serverUrl && clientSecret) {
  server.listen(serverPort, () => {
    startWebsocket(server);
    // eslint-disable-next-line no-console
    console.log(`Server draait op ${serverUrl}`);
  });
}
else {
  console.warn(`missing parameters
    clientId: ${clientId},
    serverPort: ${serverPort},
    serverUrl: ${serverUrl},
    clientUrl: ${serverUrl},
    clientSecret: ${clientSecret}`);
}
