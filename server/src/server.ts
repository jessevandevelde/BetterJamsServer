import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv';
import * as path from 'node:path';
import queueRoutes from './queue';
import deviceRoutes from './devices';
import currentTrackRoutes from './current-track';
import { isAuthorizedMiddleware } from './auth/auth-middleware';
import { startWebsocket } from './websocket/websocket';
import http from 'http';
import userRoutes from './user';
import isAuthenticatedRoutes from './is-authenticated';
import authRoutes from './auth';
import healthRoutes from './health';
import searchRoutes from './search';

const env = dotenv.config();

dotenvExpand.expand(env);

const serverPort = process.env['PORT'];
const serverUrl = process.env['SERVER_URL'];
const clientUrl = process.env['CLIENT_URL'];
const clientId = process.env['CLIENT_ID'];
const clientSecret = process.env['CLIENT_SECRET'];

const app = express();
const api = express.Router();

app.use(cookieParser());

app.use(cors ({
  origin: clientUrl,
  credentials: true,
}));

api.use(json());

api.use(isAuthorizedMiddleware);

api.use(authRoutes);
api.use('/authenticated', isAuthenticatedRoutes);
api.use('/devices', deviceRoutes);
api.use('/queue', queueRoutes);
api.use('/current-track', currentTrackRoutes);
api.use('/user', userRoutes);
api.use('/health', healthRoutes);
api.use('/search', searchRoutes);

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
