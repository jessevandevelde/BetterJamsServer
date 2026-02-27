import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import querystring from 'node:querystring';
import { spotifyFetch } from '../helpers/spotify-fetch';
import { handleApiError, HttpErrorCause } from '../helpers/errors.helpers';

export const getSearch = (spotifyApiUrl: string | undefined) => {
  return async (req: Request<null, null, null, { query: string }>, res: Response): Promise<void> => {
    const query = req.query.query as string | undefined;

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
  };
};
