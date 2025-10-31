import { getCookieFromCookies } from '../helpers/cookies.helpers';
import { getQueue } from '../queue/queue';
import type { QueueTrack } from '../queue/queue.interfaces';
import { getCurrentPositionMs } from './current-track';
import type { Request, Response } from 'express';

async function playCurrentTrack(token: string, track: QueueTrack): Promise<void> {
  await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      /* eslint-disable @typescript-eslint/naming-convention */
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      /* eslint-enable @typescript-eslint/naming-convention */
    },

    body: JSON.stringify({
      uris: [track.uri],
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      position_ms: getCurrentPositionMs(),
    }),
  });
}

export async function playTrack(req: Request, res: Response): Promise<void> {
  const accessToken = getCookieFromCookies('access_token', req.cookies);
  const queue = getQueue();
  const { currentTrack } = queue;

  if (!currentTrack) {
    return;
  }

  await playCurrentTrack(accessToken, currentTrack);

  res.send({ status: 'OK' });
}
