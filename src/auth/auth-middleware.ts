import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getCookieFromCookies } from '../helpers/cookies.helpers';

export function isAuthorizedMiddleware(req: Request, res: Response, next: NextFunction): void {
  const excludedPaths = ['/auth/login', '/auth/callback', '/authenticated'];

  if (excludedPaths.some(path => req.path.startsWith(path))) {
    next();

    return;
  }

  try {
    const refreshToken = getCookieFromCookies('refresh_token', req.cookies);

    if (req.path.startsWith('/auth/refresh')) {
      if (refreshToken) {
        next();

        return;
      }
      else {
        throw new Error();
      }
    }

    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    const { access_token } = req.cookies;

    if (!access_token || !refreshToken) {
      throw new Error();
    }

    next();
  }
  catch (_error) {
    res.status(StatusCodes.UNAUTHORIZED).send();
  }
}
