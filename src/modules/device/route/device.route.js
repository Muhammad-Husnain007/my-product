import { Router } from 'express';
import validate from '../../../middlewares/validate.middleware.js';
import { deviceSync } from '../controllers/post.controller.js';
import { deviceSyncValidator } from './device.validator.js';
import { devicePatch } from '../controllers/patch.controller.js';

const router = Router();

router.post('/sync', validate(deviceSyncValidator), deviceSync);
router.patch('/sync', validate(deviceSyncValidator), devicePatch);

export default router;
