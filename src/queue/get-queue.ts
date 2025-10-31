import type { Request, Response } from 'express';
import { getQueue as getCurrentQueue } from './queue';

const queue = getCurrentQueue();

export function getQueue(_req: Request, res: Response): void {
  res.json(queue);
}
