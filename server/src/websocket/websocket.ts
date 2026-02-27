import { Server } from 'socket.io';
import type http from 'http';
import { emitCurrentTrackProgress, intervalStarted, startTrackInterval, stopInterval } from '../current-track/current-track';
import { WebsocketEvent } from './websocket.enums';
import type { ClientToServerEvents, ServerToClientEvents } from './websocket.interfaces';
import { getQueue } from '../queue/queue';
import { getFallbackPlaylist } from '../queue/fallback-playlist';

/* eslint-disable-next-line @typescript-eslint/init-declarations */
let _io: Server<ClientToServerEvents, ServerToClientEvents>;
const connectedIds = new Set();

export function startWebsocket(server: http.Server): void {
  _io = new Server<ClientToServerEvents, ServerToClientEvents>(
    server,
    {
      cors: {
        origin: process.env['CLIENT_URL'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    },
  );

  _io.on(WebsocketEvent.connection, (socket) => {
    connectedIds.add(socket.id);

    if (!intervalStarted) {
      startTrackInterval();
    }

    const queue = getQueue();

    emitCurrentTrackProgress();
    queue.emitCurrentTrack();

    socket.on('disconnect', () => {
      connectedIds.delete(socket.id);

      if (intervalStarted && !connectedIds.size) {
        stopInterval();
        queue.clearQueue();
        getFallbackPlaylist().clearPlaylist();
      }
    });
  });
}

export function io(): Server<ClientToServerEvents, ServerToClientEvents> {
  return _io;
}
