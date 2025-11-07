import type { Request, Response } from 'express';
import type { UserRemote } from './user.interfaces';
import { User } from './user.interfaces';
import { handleApiError } from '../helpers/errors.helpers';
import { spotifyFetch } from '../helpers/spotify-fetch';

export async function getUserProfile(req: Request, res: Response): Promise<void> {
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  const { access_token } = req.cookies;

  try {
    const spotifyApiUrl = process.env.SPOTIFY_API_URL ?? '';

    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    const response = await spotifyFetch<UserRemote>(`${spotifyApiUrl}/me`, { method: 'GET', headers: { Authorization: `Bearer ${access_token}` } });

    const user: User = new User(response);

    res.send(user);
  }
  catch (error) {
    console.error(error);

    /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion */
    handleApiError(error as Error, res);
  }
}
