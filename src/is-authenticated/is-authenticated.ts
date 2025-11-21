import type { Request, Response } from 'express';
import { getCookieFromCookies } from '../helpers/cookies.helpers';

export function isAuthenticated(req: Request, _res: Response): boolean {
  const token = getCookieFromCookies('access_token', req.cookies);

  if (!token) {
    console.log('no token');

    return false;
  }
  else {
    console.log(token);

    return true;
  }
}
