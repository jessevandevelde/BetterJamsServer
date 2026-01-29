import type { Response, Request } from 'express';

export function getHealth(_req: Request, res: Response<string>): void {
  res.send('ok');
}
