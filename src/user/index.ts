import { Router } from 'express';
import { getUserProfile } from './get-user-profile';

const router = Router();

router.get('/', getUserProfile);

export default router;
