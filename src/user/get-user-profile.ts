import type { Request, Response } from 'express';
import type { UserRemote } from './user.interfaces';
import { User } from './user.interfaces';

export async function getUserProfile(req: Request, res: Response): Promise<void> {
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  const { access_token } = req.cookies;

  const response = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    headers: { Authorization: `Bearer ${access_token}` },
  });

  /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
  const remoteUser: UserRemote = await response.json();

  const user: User = new User(remoteUser);

  res.send(user);
}
