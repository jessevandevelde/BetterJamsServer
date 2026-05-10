import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { handleApiError, HttpErrorCause } from '../helpers/errors.helpers';
import { spotifyFetch } from '../helpers/spotify-fetch';

function createSpotifySearchUrl(query: string): string {
  const spotifyApiUrl = process.env['SPOTIFY_API_URL'];

  const searchParams = new URLSearchParams({
    q: query.trim(),
    type: 'track',
    limit: '10',
  });

  return `${spotifyApiUrl}/search?${searchParams.toString()}`;
}

export async function getSearchResults(req: Request<null, null, null, { query: string }>, res: Response): Promise<void> {
  const query = req.query.query as string | undefined;

  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  const { access_token } = req.cookies;

  try {
    if (!query) {
      throw new Error('Missing search query', { cause: new HttpErrorCause(StatusCodes.BAD_REQUEST) });
    }

    const response = await spotifyFetch(createSpotifySearchUrl(query),
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
