import { Router } from 'express';
import { playTrack } from './play-current-track';

const router = Router();

router.post('/play', playTrack);

export default router;
