import type { Request, Response } from 'express';
import { handleApiError, HttpErrorCause } from '../helpers/errors.helpers';
import { StatusCodes } from 'http-status-codes';
import { spotifyFetch } from '../helpers/spotify-fetch';
import querystring from 'node:querystring';

/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
const spotifyApiUrl = process.env.SPOTIFY_API_URL as string;
/* eslint-enable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-enable @typescript-eslint/non-nullable-type-assertion-style */

export async function search(req: Request<null, null, null, { query: string }>, res: Response): Promise<void> {
  const { query } = req.query;

  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  const { access_token } = req.cookies;

  try {
    if (!query) {
      throw new Error('Missing search query', { cause: new HttpErrorCause(StatusCodes.BAD_REQUEST) });
    }

    const url = `${spotifyApiUrl}/search?${querystring.stringify({
      q: query,
      type: 'track',
      limit: 20,
    })}`;

    const response = await spotifyFetch(url,
      {
        method: 'GET',
        headers: {
          /* eslint-disable-next-line @typescript-eslint/naming-convention */
          Authorization: `Bearer ${access_token}`,
        },
      });

    res.json(response);
  }

  catch (error) {
    handleApiError(error, res);
  }
}
