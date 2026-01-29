import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class HttpErrorCause {
  public code: number;

  public constructor(code: number) {
    this.code = code;
  }
}

export function handleApiError(error: unknown, res: Response): void {
  console.error(error);

  if (error instanceof Error) {
    const { cause } = error;

    if (cause instanceof HttpErrorCause) {
      res.status(cause.code).json({ error: error.message });
    }
    else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  }
}
