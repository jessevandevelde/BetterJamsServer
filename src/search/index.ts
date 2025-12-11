import { Router } from 'express';
import { search } from './search';

const router = Router();

router.get('/', search);

export default router;
