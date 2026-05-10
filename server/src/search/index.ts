import { Router } from 'express';
import { getSearchResults } from './get-search-results';

const router = Router();

router.get('/', getSearchResults);

export default router;
