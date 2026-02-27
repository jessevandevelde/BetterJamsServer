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
let clearQueueTimeout: NodeJS.Timeout | null = null;

const QUEUE_CLEAR_DELAY_MS = 30000;

function clearQueueWithFallback(): void {
  const queue = getQueue();

  stopInterval();
  queue.clearQueue();
  getFallbackPlaylist().clearPlaylist();
}

function scheduleQueueClear(): void {
  if (clearQueueTimeout) {
    return;
  }

  clearQueueTimeout = setTimeout(() => {
    clearQueueTimeout = null;

    if (connectedIds.size) {
      return;
    }

    clearQueueWithFallback();
  }, QUEUE_CLEAR_DELAY_MS);
}

function cancelScheduledQueueClear(): void {
  if (!clearQueueTimeout) {
    return;
  }

  clearTimeout(clearQueueTimeout);
  clearQueueTimeout = null;
}

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
    cancelScheduledQueueClear();

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
        scheduleQueueClear();
      }
    });
  });
}

export function io(): Server<ClientToServerEvents, ServerToClientEvents> {
  return _io;
}
