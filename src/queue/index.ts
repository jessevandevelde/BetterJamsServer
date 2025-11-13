import { Router } from 'express';
import { updateQueue } from './update-queue';
import { getQueue } from './get-queue';
import { upvoteTrack } from './upvote-track';

const router = Router();

router.post('/', updateQueue);
router.post('/upvote', upvoteTrack);
router.get('/', getQueue);

export default router;
