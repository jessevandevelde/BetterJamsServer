import type { Request, Response } from 'express';
import { getCookieFromCookies } from '../helpers/cookies.helpers';

export function isAuthenticated(req: Request, res: Response): void {
  const token = getCookieFromCookies('access_token', req.cookies);

  res.send(!!token);
}
