import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function isAuthorizedMiddleware(req: Request, res: Response, next: NextFunction): void {
  const excludedPaths = ['/login', '/callback'];

  if (excludedPaths.some(path => req.path.startsWith(path))) {
    next();

    return;
  }

  try {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    const { access_token } = req.cookies;

    if (!access_token) {
      throw new Error('Authorization failure, missing access_token');
    }

    next();
  }
  catch (_error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized: no access token' });
  }
}
