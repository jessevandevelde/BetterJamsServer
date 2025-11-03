import { Server } from 'socket.io';
import type http from 'http';
import { intervalStarted, startTrackInterval } from '../current-track/current-track';
import { WebsocketEvent } from './websocket.enums';
import { emitCurrentTrackInformation } from '../helpers/track.helpers';
import type { ClientToServerEvents, ServerToClientEvents } from './websocket.interfaces';

/* eslint-disable-next-line @typescript-eslint/init-declarations */
let _io: Server;

export function startWebsocket(server: http.Server): void {
  _io = new Server<ClientToServerEvents, ServerToClientEvents>(
    server,
    {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    },
  );

  _io.on(WebsocketEvent.connection, () => {
    if (!intervalStarted) {
      startTrackInterval();
    }

    emitCurrentTrackInformation();
  });
}

export function io(): Server {
  return _io;
}
