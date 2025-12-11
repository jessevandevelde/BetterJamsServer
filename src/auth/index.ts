import { Router } from 'express';
import { refreshTokens } from './refresh-tokens';
import { login } from './login';
import { callback } from './callback';

const router = Router();

router.post('/refresh', refreshTokens);
router.get('/login', login);
router.get('/callback', callback);

export default router;
