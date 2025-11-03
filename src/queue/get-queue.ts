import type { Request, Response } from 'express';
import { getQueue as getCurrentQueue } from './queue';

export function getQueue(_req: Request, res: Response): void {
  const { queue } = getCurrentQueue();

  res.json({ queue });
}
