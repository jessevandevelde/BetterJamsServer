import { Server } from 'socket.io';
import type http from 'http';

/* eslint-disable-next-line @typescript-eslint/init-declarations */
let _io: Server;

export function startWebsocket(server: http.Server): void {
  _io = new Server(
    server,
    {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
      },
    },
  );

  _io.on('connection', (socket) => {
    /* eslint-disable-next-line no-console */
    console.log('client connected:', socket.id);
  });
}

export function io(): Server {
  return _io;
}
