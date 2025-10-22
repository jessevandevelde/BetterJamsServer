import type { Request, Response } from 'express';
import { queue } from './update-queue';

export function getQueue(_req: Request, res: Response): void {
  res.json(queue);
}
