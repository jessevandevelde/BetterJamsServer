import { Injectable } from '@angular/core';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private readonly _socket: Socket;

  public constructor() {
    this._socket = io('http://127.0.0.1:3000');
  }

  public get socket(): Socket {
    return this._socket;
  }

  public disconnect(): void {
    this._socket.disconnect();
  }
}
