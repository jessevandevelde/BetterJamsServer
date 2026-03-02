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

type QueueClearTimeout = ReturnType<typeof setTimeout>;

let clearQueueTimeout: QueueClearTimeout | null = null;
const QUEUE_CLEAR_DELAY_MS = 30000;

// clear the queue and fallback playlist after a delay
function clearQueueWithFallback(): void {
  const queue = getQueue();

  stopInterval();
  queue.clearQueue();
  getFallbackPlaylist().clearPlaylist();
}

// check of a queue clear is already scheduled to avoid multiple timeouts being set
function hasScheduledQueueClear(): boolean {
  return clearQueueTimeout !== null;
}

// schedule a queue clear after a delay if there are no connected clients
function scheduleQueueClear(): void {
  if (hasScheduledQueueClear()) {
    return;
  }

  clearQueueTimeout = setTimeout(() => {
    // reset timeout variable to allow future queue clear scheduling
    clearQueueTimeout = null;

    // check if there are any connected clients before clearing the queue
    if (connectedIds.size > 0) {
      return;
    }

    // clear queue after timeout is done
    clearQueueWithFallback();
  }, QUEUE_CLEAR_DELAY_MS);
}

// stop a scheduled queue clear if a client reconnects to the socket before the timeout expires
function cancelScheduledQueueClear(): void {
  if (!hasScheduledQueueClear()) {
    return;
  }

  // clear the scheduled timeout to prevent the queue from being cleared while clients are connected
  if (clearQueueTimeout !== null) {
    clearTimeout(clearQueueTimeout);
  }

  // reset timeout variable to allow future queue clear scheduling
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
