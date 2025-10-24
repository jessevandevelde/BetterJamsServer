import { response, type Request, type Response } from 'express';
import { getQueue } from '../queue/queue';

export async function playCurrentTrack(token: string): Promise<void> {
  const queue = getQueue();
  const currentTrack = queue.getFirstTrack();

  if (!currentTrack) {
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
    body: JSON.stringify({ uris: [currentTrack.uri] }),
  });
  console.log(response);
}

export async function playTrack(req: Request, _res: Response): Promise<void> {
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion */
  await playCurrentTrack(req.cookies.access_token as string);
}
