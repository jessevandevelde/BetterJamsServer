import { Router } from 'express';
import { getSearch } from './search';

const router = (spotifyApiUrl: string | undefined): Router => {
  const searchRouter = Router();

  searchRouter.get('/', getSearch(spotifyApiUrl));

  return searchRouter;
};

export default router;
