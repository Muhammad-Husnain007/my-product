import { Router } from 'express';
import validate from '../../../middlewares/validate.middleware.js';
import { deviceSync } from '../controllers/post.controller.js';
import { deviceSyncValidator } from './device.validator.js';
import { devicePatch } from '../controllers/patch.controller.js';
import classBasedAccess from '../../../middlewares/classBA.middleware.js';

const router = Router();

router.post('/sync', validate(deviceSyncValidator), classBasedAccess(['user', 'lurker', 'vendor']), deviceSync);
router.patch('/sync', validate(deviceSyncValidator), classBasedAccess(['user', 'lurker', 'vendor']), devicePatch);

export default router;
