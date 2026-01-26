import { Router } from 'express';
import { getDevices } from './devices';

const router = Router();

router.get('/', getDevices);

export default router;
