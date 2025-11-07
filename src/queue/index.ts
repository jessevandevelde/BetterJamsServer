import { Router } from 'express';
import { updateQueue } from './update-queue';
import { getQueue } from './get-queue';

const router = Router();

router.post('/', updateQueue);
router.get('/', getQueue);

export default router;
