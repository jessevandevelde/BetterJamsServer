import { Injectable } from '@angular/core';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from './websocket.interfaces';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private readonly _socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  public constructor() {
    this._socket = io('http://127.0.0.1:3000', {
      withCredentials: true,
    });
  }

  public get socket(): Socket<ServerToClientEvents, ClientToServerEvents> {
    return this._socket;
  }

  public disconnect(): void {
    this._socket.disconnect();
  }
}
