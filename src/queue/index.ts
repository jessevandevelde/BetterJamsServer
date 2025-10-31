import { Router } from 'express';
import { updateQueue } from './update-queue';

const router = Router();

router.post('/', updateQueue);

export default router;
