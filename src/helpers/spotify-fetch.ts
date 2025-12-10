import { StatusCodes } from 'http-status-codes';
import { HttpErrorCause } from './errors.helpers';

interface FetchOptions {
  method: 'GET' | 'PUT' | 'POST'
  headers: {
    /* eslint-disable @typescript-eslint/naming-convention */
    'Authorization': string
    'Content-Type'?: string
  }
  body?: unknown
  /* eslint-enable @typescript-eslint/naming-convention */
}

export async function spotifyFetch<T>(url: string, options: FetchOptions): Promise<T | null> {
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-explicit-any */
  const response = await fetch(url, options as any);

  if (!response.ok) {
    throw new Error(`Spotify Api Error: ${response.statusText}`, { cause: new HttpErrorCause(response.status) });
  }

  /* eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison */
  if (response.status === StatusCodes.NO_CONTENT) {
    return null;
  }

  if (response.headers.get('Content-Type')?.includes('application/json')) {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion */
    return response.json() as Promise<T>;
  }

  /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion */
  return response.text() as Promise<T>;
}
