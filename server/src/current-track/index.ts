import { Router } from 'express';
import { playTrack } from './play-current-track';
import { pauseTrack } from './pause-track';

const router = Router();

router.post('/play', playTrack);
router.put('/pause', pauseTrack);

export default router;
