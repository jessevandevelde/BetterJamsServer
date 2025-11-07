import type { Response } from 'express';

export function createCookie(res: Response, key: string, data: unknown, maxAge?: number): void {
  res.cookie(
    key,
    data,
    {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      ...(maxAge && { maxAge }),
    },
  );
}

export function getCookieFromCookies(key: string, object: Record<string, string>): string {
  try {
    return object[key];
  }
  catch {
    throw new Error('Cookie does not exist');
  }
}
