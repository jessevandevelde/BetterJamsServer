import { Server } from 'socket.io';
import type http from 'http';
import { playCurrentTrack } from '../current-track/play-current-track';
import * as cookie from 'cookie';
import { getQueue } from '../queue/queue';

const queue = getQueue();
/* eslint-disable-next-line @typescript-eslint/init-declarations */
let _io: Server;

export function startWebsocket(server: http.Server): void {
  _io = new Server(
    server,
    {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    },
  );

  _io.on('connection', async (socket) => {
    /* eslint-disable-next-line no-console */
    console.log('Cookies:', socket.handshake.headers.cookie);

    const cookies = cookie.parse(socket.handshake.headers.cookie ?? '');

    if (queue.queue.length && !queue.getCurrentTrack()) {
      queue.setNextTrack();
    }

    await playCurrentTrack(cookies.access_token ?? '');
  });
}

export function io(): Server {
  return _io;
}
