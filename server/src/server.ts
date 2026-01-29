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
import healthRoutes from './health';

const env = dotenv.config();

dotenvExpand.expand(env);

const serverPort = process.env['PORT'];
const serverUrl = process.env['SERVER_URL'];
const clientUrl = process.env['CLIENT_URL'];
const spotifyUrl = process.env['SPOTIFY_ACCOUNT_URL'];
const clientId = process.env['CLIENT_ID'];
const clientSecret = process.env['CLIENT_SECRET'];
const redirectUri = `${serverUrl}/api/callback`;
const spotifyApiUrl = process.env['SPOTIFY_API_URL'];

const app = express();
const api = express.Router();

app.use(cookieParser());

app.use(cors ({
  origin: clientUrl,
  credentials: true,
}));

api.use(json());

app.use(isAuthorizedMiddleware);

api.use('/auth', authRoutes);
api.use('/authenticated', isAuthenticatedRoutes);
api.use('/devices', deviceRoutes);
api.use('/queue', queueRoutes);
api.use('/current-track', currentTrackRoutes);
api.use('/user', userRoutes);
api.use('/health', healthRoutes);

api.get('/login', (_req: Request, res: Response) => {
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

api.get('/callback', async (req: Request<null, null, null, { code: string, state: string }>, res: Response) => {
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
});

api.get('/search', async (req: Request<null, null, null, { query: string }>, res: Response): Promise<void> => {
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

app.use('/api', api);

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

/* eslint-disable-next-line @typescript-eslint/strict-void-return */
const server = http.createServer(app);

if (clientId && serverPort && serverUrl && clientUrl && clientSecret) {
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
    clientUrl: ${clientUrl},
    clientSecret: ${clientSecret}`);
}
