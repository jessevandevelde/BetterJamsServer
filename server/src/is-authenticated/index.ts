import { Router } from 'express';
import { isAuthenticated } from './is-authenticated';

const router = Router();

router.get('/', isAuthenticated);

export default router;
