import { Router } from 'express';
import validate from '../../../middlewares/validate.middleware.js';
import { deviceSync } from '../controllers/post.controller.js';
import { deviceSyncValidator } from './device.validator.js';

const router = Router();

router.post('/sync', validate(deviceSyncValidator), deviceSync);

export default router;
