import type { Request, Response } from 'express';
import { getQueue } from '../queue/queue';
import { getCurrentPositionMs } from './current-track';

const queue = getQueue();
const FALLBACK_TRACK_URI = 'spotify:track:76ZOzwf0oSiS69NOw8r8Nx';

async function playFallback(token: string): Promise<void> {
  await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      /* eslint-disable @typescript-eslint/naming-convention */
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      /* eslint-enable @typescript-eslint/naming-convention */
    },
    body: JSON.stringify({
      uris: [FALLBACK_TRACK_URI],
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      position_ms: 0,
    }),
  });
}

export async function playCurrentTrack(token: string): Promise<void> {
  const currentTrack = queue.getCurrentTrack();

  if (!currentTrack || !queue.hasNextTrack()) {
    await playFallback(token);

    return;
  }

  await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      /* eslint-disable @typescript-eslint/naming-convention */
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      /* eslint-enable @typescript-eslint/naming-convention */
    },

    body: JSON.stringify({
      uris: [currentTrack.uri],
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      position_ms: getCurrentPositionMs(),
    }),
  });
}

export async function playTrack(req: Request, _res: Response): Promise<void> {
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion */
  const token = req.cookies.access_token as string;

  if (!token) return;

  await playCurrentTrack(token);
}
