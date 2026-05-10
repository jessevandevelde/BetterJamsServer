import { Router } from 'express';
import { getCallback } from './get-callback';
import { getLogin } from './get-login';
import { refreshTokens } from './refresh-tokens';

const router = Router();

router.get('/login', getLogin);
router.get('/callback', getCallback);
router.post('/auth/refresh', refreshTokens);

export default router;
