import type { Request, Response } from 'express';
import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv';
import queueRoutes from './queue';
import deviceRoutes from './devices';
import currentTrackRoutes from './current-track';
import { isAuthorizedMiddleware } from './auth/auth-middleware';
import { startWebsocket } from './websocket/websocket';
import http from 'http';
import userRoutes from './user';
import isAuthenticatedRoutes from './is-authenticated';
import searchRoutes from './search';
import authRoutes from './auth';

const env = dotenv.config();

dotenvExpand.expand(env);

/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
const serverPort = process.env.SERVER_PORT as string;
const serverUrl = process.env.SERVER_URL as string;
const clientUrl = process.env.CLIENT_URL as string;
const clientId = process.env.CLIENT_ID as string;
const clientSecret = process.env.CLIENT_SECRET as string;
const app = express();
/* eslint-enable @typescript-eslint/non-nullable-type-assertion-style */

app.use(cookieParser());

app.use(cors ({
  origin: clientUrl,
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
app.use('/search', searchRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('OK');
});

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
