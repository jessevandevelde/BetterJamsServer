import type { Request, Response } from 'express';
import express, { json } from 'express';
import querystring from 'node:querystring';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv';
import * as path from 'node:path';
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
import authRoutes, { login, callback } from './auth';
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

api.use(isAuthorizedMiddleware);

api.use('/auth', authRoutes);
api.use('/authenticated', isAuthenticatedRoutes);
api.use('/devices', deviceRoutes);
api.use('/queue', queueRoutes);
api.use('/current-track', currentTrackRoutes);
api.use('/user', userRoutes);
api.use('/health', healthRoutes);

api.get('/login', login(spotifyUrl, redirectUri, clientId));

api.get('/callback', callback(spotifyUrl, clientId, clientSecret, redirectUri, clientUrl));

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
