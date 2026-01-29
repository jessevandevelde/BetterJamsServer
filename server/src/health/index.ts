import { Router } from 'express';
import { getHealth } from './get-health';

const router = Router();

router.get('/', getHealth);

export default router;
