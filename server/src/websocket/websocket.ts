import { Server } from 'socket.io';
import type http from 'http';
import { emitCurrentTrackProgress, intervalStarted, startTrackInterval } from '../current-track/current-track';
import { WebsocketEvent } from './websocket.enums';
import type { ClientToServerEvents, ServerToClientEvents } from './websocket.interfaces';
import { getQueue } from '../queue/queue';

/* eslint-disable-next-line @typescript-eslint/init-declarations */
let _io: Server<ClientToServerEvents, ServerToClientEvents>;

export function startWebsocket(server: http.Server): void {
  _io = new Server<ClientToServerEvents, ServerToClientEvents>(
    server,
    {
      cors: {
        origin: process.env.SERVER_URL,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    },
  );

  _io.on(WebsocketEvent.connection, () => {
    if (!intervalStarted) {
      startTrackInterval();
    }

    const queue = getQueue();

    emitCurrentTrackProgress();
    queue.emitCurrentTrack();
  });
}

export function io(): Server<ClientToServerEvents, ServerToClientEvents> {
  return _io;
}
