import { Router } from 'express';
import { refreshTokens } from './refresh-tokens';

const router = Router();

router.post('/refresh', refreshTokens);

export default router;
